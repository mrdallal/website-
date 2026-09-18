import "server-only";
import { prisma } from "@/lib/db/prisma";
import { AppError, NotFoundError } from "@/lib/errors";
import { normalizeMultiline, normalizeText } from "@/lib/security/sanitize";
import { slugify } from "@/lib/utils";
import type { ProjectFilters, ProjectInput, ProjectUpdate } from "@/lib/validation/project";
import type { Prisma, TaskStatus } from "@/generated/prisma/client";
import { recordActivity } from "./activities";

export function computeProgress(tasks: { status: TaskStatus }[]): number | null {
  if (tasks.length === 0) return null;
  const done = tasks.filter((t) => t.status === "DONE").length;
  return Math.round((done / tasks.length) * 100);
}

const listInclude = {
  client: { select: { id: true, name: true, company: true } },
  owner: { select: { id: true, name: true } },
  tasks: { select: { status: true } },
} satisfies Prisma.ProjectInclude;

export async function listProjects(filters: ProjectFilters) {
  const where: Prisma.ProjectWhereInput = {};
  if (filters.status) where.status = filters.status;
  if (filters.clientId) where.clientId = filters.clientId;
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { category: { contains: filters.q, mode: "insensitive" } },
      { client: { name: { contains: filters.q, mode: "insensitive" } } },
    ];
  }
  const [rows, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: listInclude,
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
    }),
    prisma.project.count({ where }),
  ]);
  const items = rows.map((p) => ({ ...p, progress: computeProgress(p.tasks), taskCount: p.tasks.length }));
  return { items, total, page: filters.page, pageSize: filters.pageSize };
}

export type ProjectListItem = Awaited<ReturnType<typeof listProjects>>["items"][number];

export async function listProjectOptions() {
  return prisma.project.findMany({
    where: { status: { in: ["DRAFT", "ACTIVE"] } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      owner: { select: { id: true, name: true, email: true } },
      tasks: {
        orderBy: [{ status: "asc" }, { position: "asc" }, { createdAt: "asc" }],
        include: { assignee: { select: { id: true, name: true } } },
      },
      activities: {
        orderBy: { createdAt: "desc" },
        take: 30,
        include: { actor: { select: { id: true, name: true } } },
      },
    },
  });
  if (!project) throw new NotFoundError("Project");
  return { ...project, progress: computeProgress(project.tasks) };
}

export type ProjectDetail = Awaited<ReturnType<typeof getProjectById>>;

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "project";
  let candidate = root;
  let i = 2;
  // Bounded loop: extremely unlikely to exceed a handful of iterations.
  while (i < 100) {
    const existing = await prisma.project.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing || existing.id === ignoreId) return candidate;
    candidate = `${root}-${i}`;
    i += 1;
  }
  throw new AppError("Could not generate a unique slug.", 409, "CONFLICT");
}

export async function createProject(input: ProjectInput, actorId?: string) {
  const name = normalizeText(input.name, 120)!;
  const slug = await uniqueSlug(input.slug || name);
  const project = await prisma.project.create({
    data: {
      name,
      slug,
      description: normalizeMultiline(input.description, 2000),
      category: normalizeText(input.category, 80),
      status: input.status,
      featured: input.featured,
      image: normalizeText(input.image, 300),
      notes: normalizeMultiline(input.notes, 5000),
      deadline: input.deadline,
      clientId: input.clientId || undefined,
      ownerId: input.ownerId || undefined,
    },
  });
  await recordActivity({ type: "PROJECT_CREATED", description: `Project "${project.name}" created`, projectId: project.id, actorId });
  return project;
}

export async function updateProject(id: string, input: ProjectUpdate, actorId?: string) {
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Project");

  const data: Prisma.ProjectUpdateInput = {};
  if (input.name !== undefined) data.name = normalizeText(input.name, 120);
  if (input.slug !== undefined) data.slug = await uniqueSlug(input.slug || input.name || existing.name, id);
  if (input.description !== undefined) data.description = normalizeMultiline(input.description, 2000) ?? null;
  if (input.category !== undefined) data.category = normalizeText(input.category, 80) ?? null;
  if (input.status !== undefined) data.status = input.status;
  if (input.featured !== undefined) data.featured = input.featured;
  if (input.image !== undefined) data.image = normalizeText(input.image, 300) ?? null;
  if (input.notes !== undefined) data.notes = normalizeMultiline(input.notes, 5000) ?? null;
  if (input.deadline !== undefined) data.deadline = input.deadline ?? null;
  if (input.clientId !== undefined) {
    data.client = input.clientId ? { connect: { id: input.clientId } } : { disconnect: true };
  }
  if (input.ownerId !== undefined) {
    data.owner = input.ownerId ? { connect: { id: input.ownerId } } : { disconnect: true };
  }

  const project = await prisma.project.update({ where: { id }, data });
  const statusChanged = input.status && input.status !== existing.status;
  await recordActivity({
    type: "PROJECT_UPDATED",
    description: statusChanged ? `Status changed from ${existing.status} to ${input.status}` : "Project details updated",
    projectId: id,
    actorId,
  });
  return project;
}

export async function deleteProject(id: string) {
  const exists = await prisma.project.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw new NotFoundError("Project");
  await prisma.project.delete({ where: { id } });
}
