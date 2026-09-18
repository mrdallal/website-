import "server-only";
import { after } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { AppError, NotFoundError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { normalizeEmail, normalizeMultiline, normalizeText, normalizeUrl } from "@/lib/security/sanitize";
import { trackServerEvent } from "@/lib/analytics/server";
import { analyticsEvents } from "@/lib/analytics/config";
import type { LeadFilters, LeadInput, LeadUpdate } from "@/lib/validation/lead";
import type { LeadStatus, Prisma } from "@/generated/prisma/client";
import { recordActivity } from "./activities";
import { runLeadCreatedAutomations } from "./automations";

const MIN_FORM_FILL_MS = 2_500;

export interface CreateLeadContext {
  source?: string;
  path?: string;
  /** Set false when calling outside a request scope (scripts, tests). */
  runAutomations?: boolean;
}

/**
 * Create a lead from validated input.
 * The lead is always persisted first; integrations run afterwards and can fail
 * independently without affecting the response to the visitor.
 */
export async function createLead(input: LeadInput, context: CreateLeadContext = {}) {
  // --- Spam heuristics (in addition to rate limiting at the edge) ---
  if (input.company_fax) {
    // Honeypot filled: pretend success without storing anything.
    logger.warn("Lead rejected: honeypot filled");
    throw new AppError("Invalid submission.", 400, "SPAM");
  }
  if (input.form_started_at && Date.now() - input.form_started_at < MIN_FORM_FILL_MS) {
    logger.warn("Lead rejected: submitted too quickly");
    throw new AppError("Please take a moment and try again.", 400, "SPAM");
  }

  const lead = await prisma.lead.create({
    data: {
      name: normalizeText(input.name, 100)!,
      email: normalizeEmail(input.email),
      company: normalizeText(input.company, 120),
      website: normalizeUrl(input.website),
      service: input.service,
      budget: input.budget,
      timeline: input.timeline,
      message: normalizeMultiline(input.message, 3000),
      source: normalizeText(context.source, 40) ?? "website",
    },
  });

  await recordActivity({
    type: "LEAD_CREATED",
    description: `Lead submitted via ${lead.source}`,
    leadId: lead.id,
    metadata: { service: lead.service, budget: lead.budget },
  });

  await trackServerEvent(analyticsEvents.leadSubmitted, {
    source: lead.source,
    path: context.path,
    metadata: { service: lead.service, budget: lead.budget },
  });

  if (context.runAutomations !== false) {
    // Run integrations after the response is sent; never block the visitor.
    try {
      after(() => runLeadCreatedAutomations(lead.id));
    } catch {
      void runLeadCreatedAutomations(lead.id);
    }
  }

  return lead;
}

export async function listLeads(filters: LeadFilters) {
  const where: Prisma.LeadWhereInput = {};
  if (filters.status) where.status = filters.status;
  if (filters.service) where.service = filters.service;
  if (filters.source) where.source = filters.source;
  if (filters.from || filters.to) {
    where.createdAt = {
      ...(filters.from ? { gte: filters.from } : {}),
      ...(filters.to ? { lte: endOfDay(filters.to) } : {}),
    };
  }
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { email: { contains: filters.q, mode: "insensitive" } },
      { company: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
    }),
    prisma.lead.count({ where }),
  ]);

  return { items, total, page: filters.page, pageSize: filters.pageSize };
}

export async function getLeadById(id: string) {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      activities: {
        orderBy: { createdAt: "desc" },
        include: { actor: { select: { id: true, name: true } } },
      },
      client: { select: { id: true, name: true } },
    },
  });
  if (!lead) throw new NotFoundError("Lead");
  return lead;
}

export type LeadDetail = Awaited<ReturnType<typeof getLeadById>>;

export async function updateLead(id: string, data: LeadUpdate, actorId?: string) {
  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Lead");

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: normalizeText(data.name, 100) } : {}),
      ...(data.email !== undefined ? { email: normalizeEmail(data.email) } : {}),
      ...(data.company !== undefined ? { company: normalizeText(data.company, 120) ?? null } : {}),
      ...(data.website !== undefined ? { website: normalizeUrl(data.website) ?? null } : {}),
      ...(data.service !== undefined ? { service: data.service } : {}),
      ...(data.budget !== undefined ? { budget: data.budget } : {}),
      ...(data.timeline !== undefined ? { timeline: data.timeline } : {}),
      ...(data.message !== undefined ? { message: normalizeMultiline(data.message, 3000) ?? null } : {}),
      ...(data.notes !== undefined ? { notes: normalizeMultiline(data.notes, 5000) ?? null } : {}),
      ...(data.source !== undefined ? { source: data.source } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
    },
  });

  if (data.status && data.status !== existing.status) {
    await recordActivity({
      type: "LEAD_STATUS_CHANGED",
      description: `Status changed from ${existing.status} to ${data.status}`,
      leadId: id,
      actorId,
      metadata: { from: existing.status, to: data.status },
    });
    await trackServerEvent(analyticsEvents.leadStatusChanged, { source: lead.source, metadata: { to: data.status } });
  } else {
    await recordActivity({ type: "LEAD_UPDATED", description: "Lead details updated", leadId: id, actorId });
  }

  return lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus, actorId?: string) {
  return updateLead(id, { status }, actorId);
}

export async function addLeadNote(id: string, note: string, actorId?: string) {
  const exists = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw new NotFoundError("Lead");
  const cleaned = normalizeMultiline(note, 2000);
  if (!cleaned) throw new AppError("Write a note first.");
  return recordActivity({ type: "NOTE", description: cleaned, leadId: id, actorId });
}

export async function deleteLead(id: string) {
  const exists = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw new NotFoundError("Lead");
  await prisma.lead.delete({ where: { id } });
}

/** Promote a lead to a client record (idempotent). */
export async function convertLeadToClient(id: string, actorId?: string) {
  const lead = await prisma.lead.findUnique({ where: { id }, include: { client: true } });
  if (!lead) throw new NotFoundError("Lead");
  if (lead.client) return lead.client;

  const client = await prisma.client.create({
    data: {
      name: lead.name,
      company: lead.company,
      email: lead.email,
      website: lead.website,
      status: "ACTIVE",
      leadId: lead.id,
    },
  });

  await recordActivity({
    type: "CLIENT_CREATED",
    description: `Converted to client ${client.name}`,
    leadId: lead.id,
    actorId,
    metadata: { clientId: client.id },
  });

  return client;
}

export async function getLeadSources(): Promise<string[]> {
  const rows = await prisma.lead.findMany({ select: { source: true }, distinct: ["source"], orderBy: { source: "asc" } });
  return rows.map((r) => r.source);
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
