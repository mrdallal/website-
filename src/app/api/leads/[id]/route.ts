import type { NextRequest } from "next/server";
import { ok, parseBody, withErrorHandling } from "@/lib/http";
import { requireApiAdmin, requireApiUser } from "@/lib/auth/session";
import { deleteLead, getLeadById, updateLead } from "@/lib/services/leads";
import { leadUpdateSchema } from "@/lib/validation/lead";

type Ctx = RouteContext<"/api/leads/[id]">;

/** GET /api/leads/[id] — admin/team. */
export const GET = withErrorHandling(async (_request: NextRequest, ctx: Ctx) => {
  await requireApiUser();
  const { id } = await ctx.params;
  const lead = await getLeadById(id);
  return ok(lead);
});

/** PATCH /api/leads/[id] — admin/team. Partial update incl. status/notes. */
export const PATCH = withErrorHandling(async (request: NextRequest, ctx: Ctx) => {
  const user = await requireApiUser();
  const { id } = await ctx.params;
  const data = await parseBody(request, leadUpdateSchema);
  const lead = await updateLead(id, data, user.id);
  return ok(lead);
});

/** DELETE /api/leads/[id] — admin only. */
export const DELETE = withErrorHandling(async (_request: NextRequest, ctx: Ctx) => {
  await requireApiAdmin();
  const { id } = await ctx.params;
  await deleteLead(id);
  return ok({ id, deleted: true });
});
