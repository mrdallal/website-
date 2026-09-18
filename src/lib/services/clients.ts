import "server-only";
import { prisma } from "@/lib/db/prisma";
import { NotFoundError } from "@/lib/errors";
import { normalizeEmail, normalizeMultiline, normalizeText, normalizeUrl } from "@/lib/security/sanitize";
import type { ClientFilters, ClientInput, ClientUpdate } from "@/lib/validation/client";
import type { Prisma } from "@/generated/prisma/client";

export async function listClients(filters: ClientFilters) {
  const where: Prisma.ClientWhereInput = {};
  if (filters.status) where.status = filters.status;
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { company: { contains: filters.q, mode: "insensitive" } },
      { email: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  const [items, total] = await Promise.all([
    prisma.client.findMany({
      where,
      include: { _count: { select: { projects: true } } },
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
    }),
    prisma.client.count({ where }),
  ]);
  return { items, total, page: filters.page, pageSize: filters.pageSize };
}

export type ClientListItem = Awaited<ReturnType<typeof listClients>>["items"][number];

export async function listClientOptions() {
  return prisma.client.findMany({ select: { id: true, name: true, company: true }, orderBy: { name: "asc" } });
}

export async function getClientById(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      projects: { orderBy: { updatedAt: "desc" }, select: { id: true, name: true, status: true, deadline: true } },
      lead: { select: { id: true, name: true, status: true } },
    },
  });
  if (!client) throw new NotFoundError("Client");
  return client;
}

export type ClientDetail = Awaited<ReturnType<typeof getClientById>>;

export async function createClient(input: ClientInput) {
  return prisma.client.create({
    data: {
      name: normalizeText(input.name, 120)!,
      company: normalizeText(input.company, 120),
      email: input.email ? normalizeEmail(input.email) : undefined,
      website: normalizeUrl(input.website),
      status: input.status,
      notes: normalizeMultiline(input.notes, 5000),
      leadId: input.leadId || undefined,
    },
  });
}

export async function updateClient(id: string, input: ClientUpdate) {
  const exists = await prisma.client.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw new NotFoundError("Client");
  const data: Prisma.ClientUpdateInput = {};
  if (input.name !== undefined) data.name = normalizeText(input.name, 120);
  if (input.company !== undefined) data.company = normalizeText(input.company, 120) ?? null;
  if (input.email !== undefined) data.email = input.email ? normalizeEmail(input.email) : null;
  if (input.website !== undefined) data.website = normalizeUrl(input.website) ?? null;
  if (input.status !== undefined) data.status = input.status;
  if (input.notes !== undefined) data.notes = normalizeMultiline(input.notes, 5000) ?? null;
  return prisma.client.update({ where: { id }, data });
}

export async function deleteClient(id: string) {
  const exists = await prisma.client.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw new NotFoundError("Client");
  await prisma.client.delete({ where: { id } });
}
