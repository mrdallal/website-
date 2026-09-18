import type { NextRequest } from "next/server";
import { created, fail, flattenZodError, ok, parseBody, withErrorHandling } from "@/lib/http";
import { requireApiUser } from "@/lib/auth/session";
import { createProject, listProjects } from "@/lib/services/projects";
import { projectFilterSchema, projectInputSchema } from "@/lib/validation/project";

/** GET /api/projects — team. */
export const GET = withErrorHandling(async (request: NextRequest) => {
  await requireApiUser();
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = projectFilterSchema.safeParse(params);
  if (!parsed.success) return fail("Invalid filters.", 422, "VALIDATION_ERROR", flattenZodError(parsed.error));
  return ok(await listProjects(parsed.data));
});

/** POST /api/projects — team. */
export const POST = withErrorHandling(async (request: NextRequest) => {
  const user = await requireApiUser();
  const data = await parseBody(request, projectInputSchema);
  const project = await createProject(data, user.id);
  return created(project);
});
