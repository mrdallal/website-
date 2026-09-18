import { z } from "zod";
import { budgetValues, leadSources, serviceValues, timelineValues } from "@/content/lead-options";
import { LeadStatus } from "@/generated/prisma/enums";
import { emptyToUndefined, optionalEnum, optionalString, paginationSchema } from "./common";

export const leadStatusValues = Object.values(LeadStatus) as [LeadStatus, ...LeadStatus[]];

/**
 * Public lead form input. Used on the client for instant feedback and again on
 * the server as the source of truth.
 */
export const leadInputSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long."),
  email: z.email("Please enter a valid email address.").max(200),
  company: optionalString(120),
  website: optionalString(200),
  service: optionalEnum(serviceValues),
  budget: optionalEnum(budgetValues),
  timeline: optionalEnum(timelineValues),
  message: optionalString(3000),
  // --- anti-spam (never shown to humans) ---
  /** Honeypot: must stay empty */
  company_fax: z.preprocess(emptyToUndefined, z.string().max(0, "Invalid submission.").optional()),
  /** Timestamp the form was rendered, to reject instant bot submissions */
  form_started_at: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

/** Dashboard edits. Everything optional; only provided keys are updated. */
export const leadUpdateSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: z.email().max(200).optional(),
  company: optionalString(120),
  website: optionalString(200),
  service: optionalEnum(serviceValues),
  budget: optionalEnum(budgetValues),
  timeline: optionalEnum(timelineValues),
  message: optionalString(3000),
  notes: optionalString(5000),
  status: optionalEnum(leadStatusValues),
  source: optionalEnum(leadSources),
});

export type LeadUpdate = z.infer<typeof leadUpdateSchema>;

export const leadStatusSchema = z.object({
  status: z.enum(leadStatusValues),
});

export const leadNoteSchema = z.object({
  note: z.string().trim().min(1, "Write a note first.").max(2000),
});

export const leadFilterSchema = paginationSchema.extend({
  status: optionalEnum(leadStatusValues),
  service: optionalEnum(serviceValues),
  source: optionalString(40),
  q: optionalString(120),
  from: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
  to: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
});

export type LeadFilters = z.infer<typeof leadFilterSchema>;
