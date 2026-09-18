import type { NextRequest } from "next/server";
import { ok, parseBody, withErrorHandling } from "@/lib/http";
import { requireApiAdmin, requireApiUser } from "@/lib/auth/session";
import { deleteProject, getProjectById, updateProject } from "@/lib/services/projects";
import { projectUpdateSchema } from "@/lib/validation/project";

type Ctx = RouteContext<"/api/projects/[id]">;

export const GET = withErrorHandling(async (_request: NextRequest, ctx: Ctx) => {
  await requireApiUser();
  const { id } = await ctx.params;
  return ok(await getProjectById(id));
});

export const PATCH = withErrorHandling(async (request: NextRequest, ctx: Ctx) => {
  const user = await requireApiUser();
  const { id } = await ctx.params;
  const data = await parseBody(request, projectUpdateSchema);
  return ok(await updateProject(id, data, user.id));
});

export const DELETE = withErrorHandling(async (_request: NextRequest, ctx: Ctx) => {
  await requireApiAdmin();
  const { id } = await ctx.params;
  await deleteProject(id);
  return ok({ id, deleted: true });
});
