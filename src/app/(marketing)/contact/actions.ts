"use server";

import { headers } from "next/headers";
import { isAppError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { submitPublicLead } from "@/lib/services/lead-intake";

export type LeadFormValues = Record<string, string>;

export type LeadFormState =
  | { status: "idle" }
  | { status: "success"; leadId: string; name: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]>; values: LeadFormValues };

const echoedFields = ["name", "email", "company", "website", "service", "budget", "timeline", "message"] as const;

/**
 * Server Action behind the public lead form.
 * Browser -> this action (Node.js) -> validation -> service -> PostgreSQL.
 */
export async function submitLeadAction(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const raw = Object.fromEntries(formData.entries());
  // Echo submitted values back on failure so the (auto-reset) form keeps them.
  const values: LeadFormValues = {};
  for (const key of echoedFields) {
    const v = raw[key];
    if (typeof v === "string") values[key] = v;
  }

  try {
    const lead = await submitPublicLead(raw, await headers(), "/contact");
    return { status: "success", leadId: lead.id, name: lead.name };
  } catch (error) {
    if (isAppError(error)) {
      return { status: "error", message: error.message, fieldErrors: error.details, values };
    }
    logger.error("Lead form submission failed", error);
    return { status: "error", message: "Something went wrong. Please try again.", values };
  }
}
