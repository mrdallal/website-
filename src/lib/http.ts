import "server-only";
import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { isAppError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

type JsonBody = Record<string, unknown> | unknown[];

export function ok<T extends JsonBody>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, { status: 200, ...init });
}

export function created<T extends JsonBody>(data: T) {
  return NextResponse.json({ ok: true, data }, { status: 201 });
}

export function fail(message: string, status = 400, code = "BAD_REQUEST", details?: Record<string, string[]>) {
  return NextResponse.json({ ok: false, error: { code, message, details } }, { status });
}

/** Turn a Zod error into a field -> messages map that the UI can render. */
export function flattenZodError(error: ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.map(String).join(".") : "_form";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

/** Parse a JSON or form body against a schema; throws ValidationError. */
export async function parseBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  let raw: unknown;
  const contentType = request.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("form")) {
      raw = Object.fromEntries((await request.formData()).entries());
    } else {
      raw = await request.json();
    }
  } catch {
    throw new ValidationError({ _form: ["Request body must be valid JSON."] }, "Invalid request body.");
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new ValidationError(flattenZodError(result.error));
  }
  return result.data;
}

/**
 * Wrap a route handler so every error becomes a safe JSON response.
 * Internal errors are logged server-side and never leaked.
 */
export function withErrorHandling<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>,
): (...args: Args) => Promise<Response> {
  return async (...args: Args) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (isAppError(error)) {
        return fail(error.message, error.status, error.code, error.details);
      }
      if (error instanceof ZodError) {
        return fail("Please check the highlighted fields.", 422, "VALIDATION_ERROR", flattenZodError(error));
      }
      logger.error("Unhandled API error", error);
      return fail("Something went wrong. Please try again.", 500, "INTERNAL_ERROR");
    }
  };
}
