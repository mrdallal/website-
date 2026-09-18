import "server-only";

/**
 * Fixed-window rate limiter with an in-memory store.
 * The `RateLimitStore` interface lets you swap in Redis/Upstash for multi-instance deployments.
 */
export interface RateLimitStore {
  increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
}

class MemoryStore implements RateLimitStore {
  private readonly hits = new Map<string, { count: number; resetAt: number }>();
  private lastSweep = Date.now();

  async increment(key: string, windowMs: number) {
    const now = Date.now();
    this.sweep(now);
    const current = this.hits.get(key);
    if (!current || current.resetAt <= now) {
      const entry = { count: 1, resetAt: now + windowMs };
      this.hits.set(key, entry);
      return entry;
    }
    current.count += 1;
    return current;
  }

  private sweep(now: number) {
    if (now - this.lastSweep < 60_000) return;
    this.lastSweep = now;
    for (const [key, entry] of this.hits) {
      if (entry.resetAt <= now) this.hits.delete(key);
    }
  }
}

const globalStore = globalThis as unknown as { __rateLimitStore?: RateLimitStore };
const store: RateLimitStore = globalStore.__rateLimitStore ?? (globalStore.__rateLimitStore = new MemoryStore());

export interface RateLimitOptions {
  /** Unique bucket name, e.g. "lead-form" */
  name: string;
  /** Identifier for the caller, usually a hashed IP */
  identifier: string;
  /** Max requests per window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export async function checkRateLimit(options: RateLimitOptions) {
  const { count, resetAt } = await store.increment(`${options.name}:${options.identifier}`, options.windowMs);
  return {
    allowed: count <= options.limit,
    remaining: Math.max(0, options.limit - count),
    resetAt,
  };
}
