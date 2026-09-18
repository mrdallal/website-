import "server-only";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

/**
 * GoHighLevel integration layer.
 *
 * TECHSIDES never depends on GHL being available: every method returns a
 * result object and never throws. When credentials are missing the service
 * reports `skipped: true` so callers can carry on (the lead is always saved
 * locally first).
 *
 * Credentials live only in environment variables and are never sent to the
 * browser.
 */

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

export interface GHLContactInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  companyName?: string;
  website?: string;
  source?: string;
  tags?: string[];
  customFields?: { key: string; value: string }[];
}

export interface GHLOpportunityInput {
  contactId: string;
  name: string;
  pipelineId: string;
  pipelineStageId: string;
  monetaryValue?: number;
  status?: "open" | "won" | "lost" | "abandoned";
}

export type GHLResult<T = undefined> =
  | { ok: true; skipped: false; data: T }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; skipped: false; error: string };

function skipped<T>(reason: string): GHLResult<T> {
  return { ok: true, skipped: true, reason };
}

function failed<T>(error: string): GHLResult<T> {
  return { ok: false, skipped: false, error };
}

export class GHLService {
  get isConfigured(): boolean {
    return env.ghl.apiConfigured;
  }

  get isWebhookConfigured(): boolean {
    return env.ghl.webhookConfigured;
  }

  private async request<T>(path: string, init: RequestInit): Promise<GHLResult<T>> {
    if (!this.isConfigured) return skipped("GHL API credentials are not configured.");
    try {
      const response = await fetch(`${GHL_API_BASE}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${env.ghl.apiKey}`,
          Version: GHL_API_VERSION,
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(init.headers ?? {}),
        },
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) {
        logger.warn("GHL request failed", { path, status: response.status });
        return failed(`GHL responded with status ${response.status}.`);
      }
      const data = (await response.json()) as T;
      return { ok: true, skipped: false, data };
    } catch (error) {
      logger.error("GHL request error", error);
      return failed("Could not reach GHL.");
    }
  }

  async createContact(input: GHLContactInput): Promise<GHLResult<{ id: string }>> {
    const result = await this.request<{ contact?: { id: string } }>("/contacts/", {
      method: "POST",
      body: JSON.stringify({
        locationId: env.ghl.locationId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        companyName: input.companyName,
        website: input.website,
        source: input.source,
        tags: input.tags,
        customFields: input.customFields,
      }),
    });
    if (!result.ok || result.skipped) return result as GHLResult<{ id: string }>;
    const id = result.data.contact?.id;
    if (!id) return failed("GHL did not return a contact id.");
    return { ok: true, skipped: false, data: { id } };
  }

  async createOpportunity(input: GHLOpportunityInput): Promise<GHLResult<{ id: string }>> {
    const result = await this.request<{ opportunity?: { id: string } }>("/opportunities/", {
      method: "POST",
      body: JSON.stringify({
        locationId: env.ghl.locationId,
        contactId: input.contactId,
        name: input.name,
        pipelineId: input.pipelineId,
        pipelineStageId: input.pipelineStageId,
        monetaryValue: input.monetaryValue,
        status: input.status ?? "open",
      }),
    });
    if (!result.ok || result.skipped) return result as GHLResult<{ id: string }>;
    const id = result.data.opportunity?.id;
    if (!id) return failed("GHL did not return an opportunity id.");
    return { ok: true, skipped: false, data: { id } };
  }

  async addTag(contactId: string, tags: string[]): Promise<GHLResult> {
    const result = await this.request<unknown>(`/contacts/${encodeURIComponent(contactId)}/tags`, {
      method: "POST",
      body: JSON.stringify({ tags }),
    });
    if (!result.ok || result.skipped) return result as GHLResult;
    return { ok: true, skipped: false, data: undefined };
  }

  /** Fire an outbound webhook (e.g. a GHL inbound-webhook trigger URL). */
  async sendWebhook(payload: Record<string, unknown>): Promise<GHLResult> {
    const url = env.ghl.webhookUrl;
    if (!url) return skipped("GHL webhook URL is not configured.");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) return failed(`Webhook responded with status ${response.status}.`);
      return { ok: true, skipped: false, data: undefined };
    } catch (error) {
      logger.error("GHL webhook error", error);
      return failed("Could not deliver webhook.");
    }
  }
}

export const ghl = new GHLService();
