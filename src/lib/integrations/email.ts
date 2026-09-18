import "server-only";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { budgetLabel, serviceLabel, timelineLabel } from "@/content/lead-options";
import type { Lead } from "@/generated/prisma/client";

/**
 * Email service behind a provider abstraction (Resend today).
 * If no API key is configured, sends are skipped and logged so the rest of the
 * lead pipeline keeps working in development.
 */

export type EmailResult =
  | { ok: true; skipped: false; id?: string }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; skipped: false; error: string };

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

let client: Resend | null = null;
function getClient(): Resend | null {
  if (!env.email.configured) return null;
  if (!client) client = new Resend(env.email.apiKey);
  return client;
}

export async function sendEmail(input: SendEmailInput): Promise<EmailResult> {
  const resend = getClient();
  if (!resend) {
    logger.info("Email skipped (RESEND_API_KEY not configured)", { subject: input.subject });
    return { ok: true, skipped: true, reason: "Email provider not configured." };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: env.email.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
    });
    if (error) {
      logger.error("Email send failed", { message: error.message });
      return { ok: false, skipped: false, error: "Email provider rejected the message." };
    }
    return { ok: true, skipped: false, id: data?.id };
  } catch (error) {
    logger.error("Email send error", error);
    return { ok: false, skipped: false, error: "Could not send email." };
  }
}

function leadSummaryRows(lead: Lead): { label: string; value: string }[] {
  return [
    { label: "Name", value: lead.name },
    { label: "Email", value: lead.email },
    { label: "Company", value: lead.company ?? "—" },
    { label: "Website", value: lead.website ?? "—" },
    { label: "Service", value: serviceLabel(lead.service) ?? "—" },
    { label: "Budget", value: budgetLabel(lead.budget) ?? "—" },
    { label: "Timeline", value: timelineLabel(lead.timeline) ?? "—" },
    { label: "Source", value: lead.source },
  ];
}

function layout(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#F4F2EC;font-family:Helvetica,Arial,sans-serif;color:#0A0A0A;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <div style="font-weight:800;letter-spacing:0.18em;font-size:12px;margin-bottom:24px;">TECHSIDES</div>
  <h1 style="font-size:24px;line-height:1.2;margin:0 0 16px;font-weight:800;">${escapeHtml(title)}</h1>
  ${body}
  <div style="margin-top:32px;border-top:1px solid #D9D9D4;padding-top:16px;font-size:12px;color:#555;">Sent by the TECHSIDES lead system.</div>
</div></body></html>`;
}

/** Internal notification to the agency when a lead is created. */
export async function sendLeadNotification(lead: Lead, notifyTo?: string): Promise<EmailResult> {
  const to = notifyTo ?? env.email.notifyTo;
  if (!to) return { ok: true, skipped: true, reason: "NOTIFY_EMAIL is not configured." };
  const rows = leadSummaryRows(lead);
  const html = layout(
    `New lead: ${lead.name}`,
    `<table style="width:100%;border-collapse:collapse;font-size:14px;">${rows
      .map(
        (r) =>
          `<tr><td style="padding:8px 0;border-bottom:1px solid #D9D9D4;color:#555;width:120px;">${escapeHtml(r.label)}</td><td style="padding:8px 0;border-bottom:1px solid #D9D9D4;">${escapeHtml(r.value)}</td></tr>`,
      )
      .join("")}</table>
    ${lead.message ? `<p style="margin-top:16px;white-space:pre-wrap;font-size:14px;">${escapeHtml(lead.message)}</p>` : ""}
    <p style="margin-top:24px;"><a href="${escapeHtml(`${env.siteUrl}/dashboard/leads/${lead.id}`)}" style="background:#0A0A0A;color:#D4F796;padding:12px 18px;text-decoration:none;font-weight:700;display:inline-block;">Open in TECHSIDES OS</a></p>`,
  );
  const text = [`New lead: ${lead.name}`, ...rows.map((r) => `${r.label}: ${r.value}`), "", lead.message ?? ""].join("\n");
  return sendEmail({ to, subject: `New lead: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`, html, text, replyTo: lead.email });
}

/** Confirmation to the person who submitted the form. */
export async function sendLeadConfirmation(lead: Lead): Promise<EmailResult> {
  const html = layout(
    "We received your message",
    `<p style="font-size:15px;line-height:1.6;">Hi ${escapeHtml(lead.name.split(" ")[0] ?? lead.name)},</p>
     <p style="font-size:15px;line-height:1.6;">Thanks for reaching out to TECHSIDES. Your enquiry has been logged (reference <strong>${escapeHtml(lead.id)}</strong>) and someone from the team will reply shortly.</p>
     <p style="font-size:15px;line-height:1.6;">In the meantime, feel free to reply to this email with anything else that would help us understand your situation.</p>`,
  );
  const text = `Hi ${lead.name},\n\nThanks for reaching out to TECHSIDES. Your enquiry has been logged (reference ${lead.id}) and someone from the team will reply shortly.`;
  return sendEmail({ to: lead.email, subject: "We received your message", html, text });
}
