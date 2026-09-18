/**
 * Minimal structured logger. Swap the sink for a provider (Axiom, Datadog, ...)
 * without touching call sites. Never log secrets or raw personal data.
 */
type Level = "debug" | "info" | "warn" | "error";

function serialize(meta: unknown): unknown {
  if (meta instanceof Error) {
    return {
      name: meta.name,
      message: meta.message,
      stack: process.env.NODE_ENV === "production" ? undefined : meta.stack,
    };
  }
  return meta;
}

function write(level: Level, message: string, meta?: unknown) {
  const entry = {
    level,
    message,
    time: new Date().toISOString(),
    ...(meta !== undefined ? { meta: serialize(meta) } : {}),
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else if (process.env.NODE_ENV !== "production" || level === "info") console.log(line);
}

export const logger = {
  debug: (message: string, meta?: unknown) => write("debug", message, meta),
  info: (message: string, meta?: unknown) => write("info", message, meta),
  warn: (message: string, meta?: unknown) => write("warn", message, meta),
  error: (message: string, meta?: unknown) => write("error", message, meta),
};
