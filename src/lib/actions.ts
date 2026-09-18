import "server-only";
import { isAppError } from "@/lib/errors";
import { logger } from "@/lib/logger";

/** Uniform result shape for Server Actions consumed by client components. */
export type ActionResult<T = undefined> =
  | { ok: true; data: T; message?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

/**
 * Run a mutation and convert any error into a safe ActionResult.
 * Redirect/notFound signals thrown by Next.js are re-thrown untouched.
 */
export async function runAction<T>(fn: () => Promise<T>, successMessage?: string): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data, message: successMessage };
  } catch (error) {
    if (isNextSignal(error)) throw error;
    if (isAppError(error)) {
      return { ok: false, message: error.message, fieldErrors: error.details };
    }
    logger.error("Server action failed", error);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}

function isNextSignal(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === "string" && (digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND"));
}
