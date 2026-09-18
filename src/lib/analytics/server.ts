import "server-only";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";
import { analyticsConfig, type AnalyticsEventName } from "./config";

/**
 * First-party, server-side conversion tracking.
 *
 * Website visits are the job of the connected provider (GA4 / Plausible /
 * PostHog). Conversion events that happen on the server (a lead being
 * created, a status changing) are recorded here so the dashboard has a
 * trustworthy source even before a provider is connected.
 */

interface TrackOptions {
  source?: string;
  path?: string;
  metadata?: Record<string, unknown>;
}

export async function trackServerEvent(name: AnalyticsEventName, options: TrackOptions = {}): Promise<void> {
  try {
    await prisma.analyticsEvent.create({
      data: {
        name,
        source: options.source,
        path: options.path,
        metadata: options.metadata ? JSON.parse(JSON.stringify(options.metadata)) : undefined,
      },
    });
  } catch (error) {
    // Analytics must never break a user-facing flow.
    logger.warn("Failed to record analytics event", { name, error: error instanceof Error ? error.message : String(error) });
  }
}

export interface AnalyticsSummary {
  provider: { name: string; label: string; configured: boolean };
  rangeDays: number;
  totalEvents: number;
  eventsByName: { name: string; count: number }[];
  leadsBySource: { source: string; count: number }[];
  leadsPerDay: { date: string; count: number }[];
  hasData: boolean;
}

export async function getAnalyticsSummary(rangeDays = 30): Promise<AnalyticsSummary> {
  const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);

  const [events, leadSources, leads] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["name"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    }),
    prisma.lead.groupBy({
      by: ["source"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    }),
    prisma.lead.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
  ]);

  const perDay = new Map<string, number>();
  for (let i = rangeDays - 1; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    perDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const lead of leads) {
    const key = lead.createdAt.toISOString().slice(0, 10);
    if (perDay.has(key)) perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }

  const eventsByName = events
    .map((e) => ({ name: e.name, count: e._count._all }))
    .sort((a, b) => b.count - a.count);
  const totalEvents = eventsByName.reduce((sum, e) => sum + e.count, 0);

  return {
    provider: {
      name: analyticsConfig.provider,
      label: analyticsConfig.providerLabel,
      configured: analyticsConfig.configured,
    },
    rangeDays,
    totalEvents,
    eventsByName,
    leadsBySource: leadSources
      .map((s) => ({ source: s.source, count: s._count._all }))
      .sort((a, b) => b.count - a.count),
    leadsPerDay: Array.from(perDay, ([date, count]) => ({ date, count })),
    hasData: totalEvents > 0 || leads.length > 0,
  };
}
