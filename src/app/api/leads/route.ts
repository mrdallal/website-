import type { NextRequest } from "next/server";
import { created, fail, ok, withErrorHandling } from "@/lib/http";
import { requireApiUser } from "@/lib/auth/session";
import { submitPublicLead } from "@/lib/services/lead-intake";
import { listLeads } from "@/lib/services/leads";
import { leadFilterSchema } from "@/lib/validation/lead";
import { flattenZodError } from "@/lib/http";

/**
 * POST /api/leads — public. Creates a lead from JSON or form data.
 * Browser -> Node.js -> rate limit -> Zod -> Prisma -> automations -> response.
 */
export const POST = withErrorHandling(async (request: NextRequest) => {
  let raw: unknown;
  const contentType = request.headers.get("content-type") ?? "";
  try {
    raw = contentType.includes("form") ? Object.fromEntries((await request.formData()).entries()) : await request.json();
  } catch {
    return fail("Request body must be valid JSON or form data.", 400, "BAD_REQUEST");
  }
  const lead = await submitPublicLead(raw, request.headers, "/api/leads");
  // Only return what the client needs; never echo stored records to the public.
  return created({ id: lead.id, status: lead.status, createdAt: lead.createdAt });
});

/**
 * GET /api/leads — admin. Lists leads with filters and pagination.
 */
export const GET = withErrorHandling(async (request: NextRequest) => {
  await requireApiUser();
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = leadFilterSchema.safeParse(params);
  if (!parsed.success) return fail("Invalid filters.", 422, "VALIDATION_ERROR", flattenZodError(parsed.error));
  const result = await listLeads(parsed.data);
  return ok(result);
});
