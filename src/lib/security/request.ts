import "server-only";
import { createHash } from "node:crypto";

/** Best-effort client IP extraction behind Vercel / proxies. */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? headers.get("cf-connecting-ip") ?? "unknown";
}

/** One-way hash so we can rate limit / dedupe without storing raw IPs. */
export function hashIdentifier(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}
