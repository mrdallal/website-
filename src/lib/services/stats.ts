import "server-only";
import { prisma } from "@/lib/db/prisma";
import { listRecentActivity } from "./activities";

/**
 * Dashboard overview numbers. Everything here is computed from the database;
 * when there is no data the UI shows 0 / "No data yet" rather than samples.
 */
export async function getDashboardStats() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const now = new Date();

  const [
    newLeads,
    leadsThisWeek,
    totalLeads,
    wonLeads,
    lostLeads,
    activeProjects,
    openTasks,
    overdueTasks,
    pipeline,
    recentLeads,
    recentActivity,
    upcomingTasks,
  ] = await Promise.all([
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "WON" } }),
    prisma.lead.count({ where: { status: "LOST" } }),
    prisma.project.count({ where: { status: "ACTIVE" } }),
    prisma.task.count({ where: { status: { not: "DONE" } } }),
    prisma.task.count({ where: { status: { not: "DONE" }, dueDate: { lt: now } } }),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    listRecentActivity(8),
    prisma.task.findMany({
      where: { status: { not: "DONE" }, dueDate: { not: null } },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { project: { select: { id: true, name: true } }, assignee: { select: { id: true, name: true } } },
    }),
  ]);

  const closed = wonLeads + lostLeads;
  const conversionRate = closed > 0 ? Math.round((wonLeads / closed) * 100) : null;

  return {
    newLeads,
    leadsThisWeek,
    totalLeads,
    wonLeads,
    lostLeads,
    activeProjects,
    openTasks,
    overdueTasks,
    conversionRate,
    pipeline: pipeline.map((p) => ({ status: p.status, count: p._count._all })),
    recentLeads,
    recentActivity,
    upcomingTasks,
  };
}

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>;
