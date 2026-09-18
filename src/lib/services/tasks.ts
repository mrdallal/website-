import "server-only";
import { prisma } from "@/lib/db/prisma";
import { NotFoundError } from "@/lib/errors";
import { normalizeMultiline, normalizeText } from "@/lib/security/sanitize";
import type { TaskFilters, TaskInput, TaskUpdate } from "@/lib/validation/task";
import type { Prisma, TaskStatus } from "@/generated/prisma/client";
import { recordActivity } from "./activities";

const taskInclude = {
  project: { select: { id: true, name: true } },
  assignee: { select: { id: true, name: true } },
} satisfies Prisma.TaskInclude;

export async function listTasks(filters: TaskFilters = {}) {
  const where: Prisma.TaskWhereInput = {};
  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.assigneeId) where.assigneeId = filters.assigneeId;
  if (filters.q) where.title = { contains: filters.q, mode: "insensitive" };

  return prisma.task.findMany({
    where,
    include: taskInclude,
    orderBy: [{ status: "asc" }, { position: "asc" }, { dueDate: "asc" }, { createdAt: "asc" }],
  });
}

export type TaskListItem = Awaited<ReturnType<typeof listTasks>>[number];

export async function getTaskById(id: string) {
  const task = await prisma.task.findUnique({ where: { id }, include: taskInclude });
  if (!task) throw new NotFoundError("Task");
  return task;
}

export async function createTask(input: TaskInput, actorId?: string) {
  const project = await prisma.project.findUnique({ where: { id: input.projectId }, select: { id: true, name: true } });
  if (!project) throw new NotFoundError("Project");

  const last = await prisma.task.findFirst({
    where: { projectId: input.projectId, status: input.status },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const task = await prisma.task.create({
    data: {
      title: normalizeText(input.title, 200)!,
      description: normalizeMultiline(input.description, 2000),
      status: input.status,
      priority: input.priority,
      projectId: input.projectId,
      assigneeId: input.assigneeId || undefined,
      dueDate: input.dueDate,
      position: (last?.position ?? -1) + 1,
    },
    include: taskInclude,
  });

  await recordActivity({ type: "TASK_CREATED", description: `Task "${task.title}" created`, projectId: project.id, actorId });
  return task;
}

export async function updateTask(id: string, input: TaskUpdate, actorId?: string) {
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Task");

  const data: Prisma.TaskUncheckedUpdateInput = {};
  if (input.title !== undefined) data.title = normalizeText(input.title, 200);
  if (input.description !== undefined) data.description = normalizeMultiline(input.description, 2000) ?? null;
  if (input.status !== undefined) data.status = input.status;
  if (input.priority !== undefined) data.priority = input.priority;
  if (input.projectId !== undefined) data.projectId = input.projectId;
  if (input.assigneeId !== undefined) data.assigneeId = input.assigneeId || null;
  if (input.dueDate !== undefined) data.dueDate = input.dueDate ?? null;
  if (input.position !== undefined) data.position = input.position;

  const task = await prisma.task.update({ where: { id }, data, include: taskInclude });
  const statusChanged = input.status && input.status !== existing.status;
  await recordActivity({
    type: "TASK_UPDATED",
    description: statusChanged ? `Task "${task.title}" moved to ${input.status}` : `Task "${task.title}" updated`,
    projectId: task.projectId,
    actorId,
  });
  return task;
}

export async function moveTask(id: string, status: TaskStatus, actorId?: string) {
  const existing = await prisma.task.findUnique({ where: { id }, select: { projectId: true } });
  if (!existing) throw new NotFoundError("Task");
  const last = await prisma.task.findFirst({
    where: { projectId: existing.projectId, status },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  return updateTask(id, { status, position: (last?.position ?? -1) + 1 }, actorId);
}

export async function deleteTask(id: string) {
  const exists = await prisma.task.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw new NotFoundError("Task");
  await prisma.task.delete({ where: { id } });
}
