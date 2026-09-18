import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { getAnalyticsSummary } from "@/lib/analytics/server";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatBlock } from "@/components/dashboard/stat-block";
import { humanize } from "@/lib/utils";

export const metadata: Metadata = { title: "Analytics" };

const providers = [
  { id: "ga4", label: "Google Analytics 4", env: "NEXT_PUBLIC_ANALYTICS_PROVIDER=ga4 + NEXT_PUBLIC_GA4_MEASUREMENT_ID" },
  { id: "plausible", label: "Plausible", env: "NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible + NEXT_PUBLIC_PLAUSIBLE_DOMAIN" },
  { id: "posthog", label: "PostHog", env: "NEXT_PUBLIC_ANALYTICS_PROVIDER=posthog + NEXT_PUBLIC_POSTHOG_KEY" },
];

export default async function AnalyticsPage() {
  await requireUser();
  const summary = await getAnalyticsSummary(30);
  const leadSubmissions = summary.eventsByName.find((e) => e.name === "lead_submitted")?.count ?? 0;
  const maxPerDay = Math.max(1, ...summary.leadsPerDay.map((d) => d.count));
  const totalLeads30 = summary.leadsPerDay.reduce((s, d) => s + d.count, 0);

  return (
    <>
      <PageHeader
        eyebrow="Measurement"
        title="Analytics"
        description="Website traffic comes from the connected provider. Conversion events are recorded first-party on the server, so lead numbers are always real."
        actions={
          <Badge tone={summary.provider.configured ? "ok" : "muted"} dot>
            {summary.provider.configured ? `${summary.provider.label} connected` : "No provider connected"}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatBlock label="Website visits" value={null} hint={summary.provider.configured ? `Reported inside ${summary.provider.label}` : "Connect a provider to track visits"} />
        <StatBlock label="Lead submissions (30d)" value={leadSubmissions} hint="Recorded server-side" accent />
        <StatBlock label="Leads (30d)" value={totalLeads30} hint="Stored in PostgreSQL" />
        <StatBlock label="Conversion events (30d)" value={summary.totalEvents} hint="All first-party events" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <DashboardCard title="Leads per day" eyebrow="Last 30 days" className="xl:col-span-2">
          {totalLeads30 === 0 ? (
            <EmptyState compact title="No leads in the last 30 days." description="The daily breakdown will appear once leads start arriving." />
          ) : (
            <div>
              <ol className="flex h-40 items-end gap-[3px]" aria-label="Leads per day">
                {summary.leadsPerDay.map((d) => (
                  <li key={d.date} className="group relative flex h-full flex-1 items-end" title={`${d.date}: ${d.count}`}>
                    <span
                      className={d.count > 0 ? "w-full bg-ink group-hover:bg-lime" : "w-full bg-raised"}
                      style={{ height: `${d.count > 0 ? Math.max(6, (d.count / maxPerDay) * 100) : 2}%` }}
                    />
                    <span className="sr-only">
                      {d.date}: {d.count}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-2 flex justify-between font-mono text-[11px] text-mute">
                <span>{summary.leadsPerDay[0]?.date}</span>
                <span>{summary.leadsPerDay[summary.leadsPerDay.length - 1]?.date}</span>
              </div>
            </div>
          )}
        </DashboardCard>

        <DashboardCard title="Lead sources" eyebrow="Last 30 days">
          {summary.leadsBySource.length === 0 ? (
            <EmptyState compact title="No data yet." description="Sources are recorded with every lead (website, referral, manual, GHL)." />
          ) : (
            <ul className="divide-y divide-bone/10">
              {summary.leadsBySource.map((s) => (
                <li key={s.source} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-mono text-xs">{s.source}</span>
                  <span className="font-semibold">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard title="Conversion events" eyebrow="By event name">
          {summary.eventsByName.length === 0 ? (
            <EmptyState compact title="No events yet." description="lead_submitted and lead_status_changed are tracked automatically." />
          ) : (
            <ul className="divide-y divide-bone/10">
              {summary.eventsByName.map((e) => (
                <li key={e.name} className="flex items-center justify-between py-2.5 text-sm">
                  <span>{humanize(e.name)}</span>
                  <span className="font-mono text-xs">{e.count}</span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard title="Website analytics provider" eyebrow="Traffic, pages, referrers" className="xl:col-span-2">
          {summary.provider.configured ? (
            <p className="text-sm">
              <strong>{summary.provider.label}</strong> is loaded on every public page. Visits, pages and referrers are available in the provider dashboard; conversion events on this page remain first-party.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-mute">Analytics will appear once tracking is connected. Set the environment variables for one provider and redeploy:</p>
              <ul className="divide-y divide-bone/10 border border-bone/10">
                {providers.map((p) => (
                  <li key={p.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-semibold">{p.label}</span>
                    <code className="font-mono text-[11px] text-mute">{p.env}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DashboardCard>
      </div>
    </>
  );
}
