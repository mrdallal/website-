import { z } from "zod";
import { optionalString } from "./common";

/**
 * Editable agency settings stored in the Setting table.
 * Secrets (API keys) are NOT settings; they live in environment variables.
 */
export const settingKeys = [
  "agency_name",
  "notify_email",
  "booking_url",
  "ghl_pipeline_id",
  "ghl_pipeline_stage_id",
  "lead_auto_reply_enabled",
] as const;

export type SettingKey = (typeof settingKeys)[number];

export const settingsSchema = z.object({
  agency_name: optionalString(80),
  notify_email: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.email("Enter a valid email.").optional(),
  ),
  booking_url: optionalString(300),
  ghl_pipeline_id: optionalString(100),
  ghl_pipeline_stage_id: optionalString(100),
  lead_auto_reply_enabled: z.preprocess(
    (v) => (typeof v === "boolean" ? v : v === "on" || v === "true"),
    z.boolean().default(false),
  ),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
