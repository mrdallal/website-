import "server-only";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { ghl } from "@/lib/integrations/ghl";
import { sendLeadConfirmation, sendLeadNotification } from "@/lib/integrations/email";
import { serviceLabel } from "@/content/lead-options";
import { recordActivity } from "./activities";
import { getSettings } from "./settings";

/**
 * Lead-created automation pipeline.
 *
 *   Lead saved
 *     -> Create GHL contact
 *     -> Create GHL opportunity (if pipeline configured)
 *     -> Fire GHL webhook (if configured)
 *     -> Internal notification email
 *     -> Confirmation email to the lead (if enabled)
 *
 * Every step is isolated: a failure is recorded as an activity and the
 * pipeline continues. This runs in-process today; the step functions are
 * pure enough to move to a queue/background worker later.
 */

export interface AutomationStepResult {
  step: string;
  status: "done" | "skipped" | "failed";
  detail?: string;
}

type Step = { name: string; run: () => Promise<AutomationStepResult> };

export async function runLeadCreatedAutomations(leadId: string): Promise<AutomationStepResult[]> {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return [];

  const settings = await getSettings();
  const results: AutomationStepResult[] = [];
  let ghlContactId: string | null = null;

  const steps: Step[] = [
    {
      name: "ghl.createContact",
      run: async () => {
        const [firstName, ...rest] = lead.name.split(" ");
        const result = await ghl.createContact({
          firstName: firstName ?? lead.name,
          lastName: rest.join(" ") || undefined,
          email: lead.email,
          companyName: lead.company ?? undefined,
          website: lead.website ?? undefined,
          source: `techsides-${lead.source}`,
          tags: ["techsides-website", lead.service ? `service:${lead.service}` : "service:unspecified"],
        });
        if (result.skipped) return { step: "ghl.createContact", status: "skipped", detail: result.reason };
        if (!result.ok) return { step: "ghl.createContact", status: "failed", detail: result.error };
        ghlContactId = result.data.id;
        await prisma.lead.update({ where: { id: lead.id }, data: { ghlContactId, ghlSyncedAt: new Date() } });
        return { step: "ghl.createContact", status: "done", detail: `Contact ${ghlContactId}` };
      },
    },
    {
      name: "ghl.createOpportunity",
      run: async () => {
        if (!ghlContactId) return { step: "ghl.createOpportunity", status: "skipped", detail: "No GHL contact." };
        if (!settings.ghl_pipeline_id || !settings.ghl_pipeline_stage_id) {
          return { step: "ghl.createOpportunity", status: "skipped", detail: "Pipeline not configured in settings." };
        }
        const result = await ghl.createOpportunity({
          contactId: ghlContactId,
          name: `${lead.name}${lead.company ? ` – ${lead.company}` : ""} – ${serviceLabel(lead.service) ?? "Enquiry"}`,
          pipelineId: settings.ghl_pipeline_id,
          pipelineStageId: settings.ghl_pipeline_stage_id,
        });
        if (result.skipped) return { step: "ghl.createOpportunity", status: "skipped", detail: result.reason };
        if (!result.ok) return { step: "ghl.createOpportunity", status: "failed", detail: result.error };
        return { step: "ghl.createOpportunity", status: "done", detail: `Opportunity ${result.data.id}` };
      },
    },
    {
      name: "ghl.webhook",
      run: async () => {
        const result = await ghl.sendWebhook({
          event: "lead.created",
          lead: {
            id: lead.id,
            name: lead.name,
            email: lead.email,
            company: lead.company,
            website: lead.website,
            service: lead.service,
            budget: lead.budget,
            timeline: lead.timeline,
            message: lead.message,
            source: lead.source,
            createdAt: lead.createdAt.toISOString(),
          },
        });
        if (result.skipped) return { step: "ghl.webhook", status: "skipped", detail: result.reason };
        if (!result.ok) return { step: "ghl.webhook", status: "failed", detail: result.error };
        return { step: "ghl.webhook", status: "done" };
      },
    },
    {
      name: "email.notifyTeam",
      run: async () => {
        const result = await sendLeadNotification(lead, settings.notify_email || undefined);
        if (result.skipped) return { step: "email.notifyTeam", status: "skipped", detail: result.reason };
        if (!result.ok) return { step: "email.notifyTeam", status: "failed", detail: result.error };
        return { step: "email.notifyTeam", status: "done" };
      },
    },
    {
      name: "email.confirmLead",
      run: async () => {
        if (settings.lead_auto_reply_enabled !== "true") {
          return { step: "email.confirmLead", status: "skipped", detail: "Auto-reply disabled in settings." };
        }
        const result = await sendLeadConfirmation(lead);
        if (result.skipped) return { step: "email.confirmLead", status: "skipped", detail: result.reason };
        if (!result.ok) return { step: "email.confirmLead", status: "failed", detail: result.error };
        return { step: "email.confirmLead", status: "done" };
      },
    },
  ];

  for (const step of steps) {
    try {
      const result = await step.run();
      results.push(result);
      if (result.status !== "skipped") {
        await recordActivity({
          type: "INTEGRATION",
          description: `${step.name}: ${result.status}${result.detail ? ` (${result.detail})` : ""}`,
          leadId: lead.id,
        });
      }
    } catch (error) {
      logger.error(`Automation step ${step.name} threw`, error);
      results.push({ step: step.name, status: "failed", detail: "Unexpected error" });
      await recordActivity({ type: "INTEGRATION", description: `${step.name}: failed (unexpected error)`, leadId: lead.id });
    }
  }

  logger.info("Lead automations finished", { leadId: lead.id, results: results.map((r) => `${r.step}=${r.status}`) });
  return results;
}

/** Static description of the pipeline for the dashboard "Automations" page. */
export interface AutomationDescriptor {
  id: string;
  name: string;
  trigger: string;
  description: string;
  configured: boolean;
  requirement: string;
}

export async function describeAutomations(): Promise<AutomationDescriptor[]> {
  const settings = await getSettings();
  return [
    {
      id: "lead-save",
      name: "Save lead to database",
      trigger: "Lead created",
      description: "Every submission is validated, sanitised and stored in PostgreSQL with a unique ID.",
      configured: true,
      requirement: "Always on",
    },
    {
      id: "ghl-contact",
      name: "Create GHL contact",
      trigger: "Lead created",
      description: "Creates or tags a contact in GoHighLevel with the lead details and service tag.",
      configured: env.ghl.apiConfigured,
      requirement: "GHL_API_KEY and GHL_LOCATION_ID",
    },
    {
      id: "ghl-opportunity",
      name: "Create GHL opportunity",
      trigger: "After GHL contact",
      description: "Opens an opportunity in your configured pipeline stage.",
      configured: env.ghl.apiConfigured && Boolean(settings.ghl_pipeline_id && settings.ghl_pipeline_stage_id),
      requirement: "GHL API + pipeline IDs in Settings",
    },
    {
      id: "ghl-webhook",
      name: "Send GHL webhook",
      trigger: "Lead created",
      description: "Posts the lead payload to a GHL inbound webhook to trigger your workflows.",
      configured: env.ghl.webhookConfigured,
      requirement: "GHL_WEBHOOK_URL",
    },
    {
      id: "email-team",
      name: "Notify the team",
      trigger: "Lead created",
      description: "Emails the new lead summary with a link into TECHSIDES OS.",
      configured: env.email.configured && Boolean(settings.notify_email || env.email.notifyTo),
      requirement: "RESEND_API_KEY + notify email",
    },
    {
      id: "email-confirm",
      name: "Confirmation email to lead",
      trigger: "Lead created",
      description: "Sends the lead a short confirmation with their reference ID.",
      configured: env.email.configured && settings.lead_auto_reply_enabled === "true",
      requirement: "RESEND_API_KEY + auto-reply enabled in Settings",
    },
  ];
}
