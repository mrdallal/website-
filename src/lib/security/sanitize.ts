/**
 * Input normalisation helpers. Zod handles validation; these make stored
 * values predictable and strip control characters that could poison logs/emails.
 */
const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

export function stripControlChars(value: string): string {
  return value.replace(CONTROL_CHARS, "");
}

export function normalizeText(value: string | undefined | null, maxLength: number): string | undefined {
  if (value == null) return undefined;
  const cleaned = stripControlChars(value).replace(/\s+/g, " ").trim();
  if (!cleaned) return undefined;
  return cleaned.slice(0, maxLength);
}

export function normalizeMultiline(value: string | undefined | null, maxLength: number): string | undefined {
  if (value == null) return undefined;
  const cleaned = stripControlChars(value).replace(/\r\n/g, "\n").trim();
  if (!cleaned) return undefined;
  return cleaned.slice(0, maxLength);
}

export function normalizeUrl(value: string | undefined | null): string | undefined {
  const text = normalizeText(value, 300);
  if (!text) return undefined;
  const withScheme = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(withScheme);
    if (!["http:", "https:"].includes(url.protocol)) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function normalizeEmail(value: string): string {
  return stripControlChars(value).trim().toLowerCase();
}
