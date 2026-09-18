import type { NextRequest } from "next/server";
import { created, fail, withErrorHandling } from "@/lib/http";
import { submitPublicLead } from "@/lib/services/lead-intake";

/**
 * POST /api/contact — public alias of POST /api/leads for external embeds
 * (e.g. a form on another site). Same validation, rate limiting and pipeline.
 */
export const POST = withErrorHandling(async (request: NextRequest) => {
  let raw: unknown;
  const contentType = request.headers.get("content-type") ?? "";
  try {
    raw = contentType.includes("form") ? Object.fromEntries((await request.formData()).entries()) : await request.json();
  } catch {
    return fail("Request body must be valid JSON or form data.", 400, "BAD_REQUEST");
  }
  const lead = await submitPublicLead(raw, request.headers, "/api/contact");
  return created({ id: lead.id, status: lead.status, createdAt: lead.createdAt });
});
