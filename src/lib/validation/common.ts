import { z } from "zod";

/** Treat empty strings (from HTML forms) as "not provided". */
export const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const optionalString = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max, `Must be ${max} characters or fewer.`).optional());

export const optionalEnum = <const T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess(emptyToUndefined, z.enum(values).optional());

export const optionalDate = z.preprocess(emptyToUndefined, z.coerce.date().optional());

/** HTML checkboxes submit "on"; JSON clients submit booleans. */
export const checkbox = z.preprocess((v) => {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v === "on" || v === "true" || v === "1";
  return false;
}, z.boolean());

export const idSchema = z.string().trim().min(1).max(64);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});
