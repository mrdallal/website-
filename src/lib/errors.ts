/**
 * Application-level errors. Anything that is not an AppError is treated as an
 * unexpected internal error and is never surfaced to clients verbatim.
 */
export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: Record<string, string[]>;

  constructor(message: string, status = 400, code = "BAD_REQUEST", details?: Record<string, string[]>) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(entity = "Resource") {
    super(`${entity} not found.`, 404, "NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to do that.") {
    super(message, 403, "FORBIDDEN");
  }
}

export class ValidationError extends AppError {
  constructor(details: Record<string, string[]>, message = "Please check the highlighted fields.") {
    super(message, 422, "VALIDATION_ERROR", details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Please try again in a moment.") {
    super(message, 429, "RATE_LIMITED");
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
