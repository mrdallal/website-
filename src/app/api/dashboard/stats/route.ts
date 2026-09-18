import { ok, withErrorHandling } from "@/lib/http";
import { requireApiUser } from "@/lib/auth/session";
import { getDashboardStats } from "@/lib/services/stats";

/** GET /api/dashboard/stats — team. Overview numbers computed from the database. */
export const GET = withErrorHandling(async () => {
  await requireApiUser();
  const stats = await getDashboardStats();
  return ok({
    newLeads: stats.newLeads,
    leadsThisWeek: stats.leadsThisWeek,
    totalLeads: stats.totalLeads,
    activeProjects: stats.activeProjects,
    openTasks: stats.openTasks,
    overdueTasks: stats.overdueTasks,
    conversionRate: stats.conversionRate,
    pipeline: stats.pipeline,
  });
});
