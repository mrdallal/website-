import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { fail, ok, withErrorHandling } from "@/lib/http";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/db/prisma";
import { recordActivity } from "@/lib/services/activities";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp, hashIdentifier } from "@/lib/security/request";

/**
 * POST /api/webhooks/ghl — inbound events from GoHighLevel workflows.
 *
 * Secured with a shared secret (GHL_WEBHOOK_SECRET) sent in the
 * `x-ghl-signature` header. When the secret is not configured the endpoint
 * refuses all requests rather than accepting unauthenticated input.
 *
 * Supported events are intentionally small; extend `handlers` as workflows grow.
 */
const payloadSchema = z.object({
  event: z.string().min(1).max(100),
  leadId: z.string().min(1).max(64).optional(),
  contactId: z.string().min(1).max(100).optional(),
  email: z.email().optional(),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"]).optional(),
  note: z.string().max(2000).optional(),
});

function secretMatches(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const POST = withErrorHandling(async (request: NextRequest) => {
  const secret = env.ghl.webhookSecret;
  if (!secret) return fail("Webhook not configured.", 503, "NOT_CONFIGURED");
  if (!secretMatches(request.headers.get("x-ghl-signature"), secret)) {
    return fail("Invalid signature.", 401, "UNAUTHORIZED");
  }

  const limit = await checkRateLimit({
    name: "ghl-webhook",
    identifier: hashIdentifier(getClientIp(request.headers)),
    limit: 120,
    windowMs: 60_000,
  });
  if (!limit.allowed) return fail("Too many requests.", 429, "RATE_LIMITED");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Body must be JSON.", 400, "BAD_REQUEST");
  }
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) return fail("Invalid payload.", 422, "VALIDATION_ERROR");
  const payload = parsed.data;

  // Resolve the lead by id, GHL contact id, or email (most recent).
  const lead = payload.leadId
    ? await prisma.lead.findUnique({ where: { id: payload.leadId } })
    : payload.contactId
      ? await prisma.lead.findFirst({ where: { ghlContactId: payload.contactId }, orderBy: { createdAt: "desc" } })
      : payload.email
        ? await prisma.lead.findFirst({ where: { email: payload.email.toLowerCase() }, orderBy: { createdAt: "desc" } })
        : null;

  if (!lead) {
    logger.info("GHL webhook received for unknown lead", { event: payload.event });
    return ok({ received: true, matched: false });
  }

  if (payload.status && payload.status !== lead.status) {
    await prisma.lead.update({ where: { id: lead.id }, data: { status: payload.status } });
    await recordActivity({
      type: "LEAD_STATUS_CHANGED",
      description: `Status changed from ${lead.status} to ${payload.status} via GHL (${payload.event})`,
      leadId: lead.id,
      metadata: { from: lead.status, to: payload.status, source: "ghl" },
    });
  } else {
    await recordActivity({
      type: "INTEGRATION",
      description: `GHL event: ${payload.event}${payload.note ? ` — ${payload.note}` : ""}`,
      leadId: lead.id,
      metadata: { source: "ghl", event: payload.event },
    });
  }

  if (payload.contactId && !lead.ghlContactId) {
    await prisma.lead.update({ where: { id: lead.id }, data: { ghlContactId: payload.contactId, ghlSyncedAt: new Date() } });
  }

  return ok({ received: true, matched: true, leadId: lead.id });
});
