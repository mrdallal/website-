import "server-only";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";
import type { ActivityType } from "@/generated/prisma/enums";

export interface RecordActivityInput {
  type: ActivityType;
  description: string;
  leadId?: string | null;
  projectId?: string | null;
  actorId?: string | null;
  metadata?: Record<string, unknown>;
}

/** Append to the audit trail. Never throws: a missing activity row must not break a mutation. */
export async function recordActivity(input: RecordActivityInput) {
  try {
    return await prisma.activity.create({
      data: {
        type: input.type,
        description: input.description,
        leadId: input.leadId ?? undefined,
        projectId: input.projectId ?? undefined,
        actorId: input.actorId ?? undefined,
        metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : undefined,
      },
    });
  } catch (error) {
    logger.warn("Failed to record activity", { type: input.type, error: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

export async function listRecentActivity(limit = 10) {
  return prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      actor: { select: { id: true, name: true } },
      lead: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
    },
  });
}

export type ActivityWithRelations = Awaited<ReturnType<typeof listRecentActivity>>[number];
