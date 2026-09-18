import "server-only";
import { RateLimitError, ValidationError } from "@/lib/errors";
import { flattenZodError } from "@/lib/http";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp, hashIdentifier } from "@/lib/security/request";
import { leadInputSchema } from "@/lib/validation/lead";
import { createLead } from "./leads";

/**
 * Public lead intake shared by the server action and the REST endpoint.
 *
 *   raw input -> rate limit (per hashed IP) -> Zod validation -> createLead
 */
export async function submitPublicLead(raw: unknown, headers: Headers, path?: string) {
  const ip = getClientIp(headers);
  const limit = await checkRateLimit({
    name: "lead-intake",
    identifier: hashIdentifier(ip),
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.allowed) throw new RateLimitError();

  const parsed = leadInputSchema.safeParse(raw);
  if (!parsed.success) throw new ValidationError(flattenZodError(parsed.error));

  return createLead(parsed.data, { source: "website", path });
}
