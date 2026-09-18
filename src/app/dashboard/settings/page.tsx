import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { env } from "@/lib/env";
import { analyticsConfig } from "@/lib/analytics/config";
import { getSettings } from "@/lib/services/settings";
import { listTeamMembers } from "@/lib/services/users";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { TeamMemberForm } from "@/components/dashboard/team-member-form";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN";
  const [settings, team] = await Promise.all([getSettings(), listTeamMembers()]);

  const integrations = [
    { label: "PostgreSQL", ok: Boolean(env.databaseUrl), detail: "DATABASE_URL" },
    { label: "Auth secret", ok: Boolean(env.authSecret), detail: "AUTH_SECRET" },
    { label: "Email (Resend)", ok: env.email.configured, detail: "RESEND_API_KEY" },
    { label: "GHL API", ok: env.ghl.apiConfigured, detail: "GHL_API_KEY + GHL_LOCATION_ID" },
    { label: "GHL outbound webhook", ok: env.ghl.webhookConfigured, detail: "GHL_WEBHOOK_URL" },
    { label: "GHL inbound webhook secret", ok: Boolean(env.ghl.webhookSecret), detail: "GHL_WEBHOOK_SECRET" },
    { label: "Analytics provider", ok: analyticsConfig.configured, detail: analyticsConfig.configured ? analyticsConfig.providerLabel : "NEXT_PUBLIC_ANALYTICS_PROVIDER" },
  ];

  return (
    <>
      <PageHeader eyebrow="Configuration" title="Settings" description="Agency settings are stored in the database. Secrets and API keys stay in environment variables and are never shown here." />

      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardCard title="Agency settings" className="xl:col-span-2">
          <SettingsForm settings={settings} disabled={!isAdmin} />
        </DashboardCard>

        <DashboardCard title="Integrations" eyebrow="From environment" padded={false}>
          <ul className="divide-y divide-bone/10">
            {integrations.map((i) => (
              <li key={i.label} className="flex items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="text-sm font-semibold">{i.label}</p>
                  <p className="font-mono text-[11px] text-mute">{i.detail}</p>
                </div>
                <Badge tone={i.ok ? "ok" : "muted"} dot>
                  {i.ok ? "Set" : "Missing"}
                </Badge>
              </li>
            ))}
          </ul>
          <p className="px-5 py-3 text-xs text-mute">Values are read at runtime. Update .env (or your hosting provider) and redeploy to change them.</p>
        </DashboardCard>

        <DashboardCard title="Team" eyebrow={`${team.length} member${team.length === 1 ? "" : "s"}`} padded={false} className="xl:col-span-2">
          <ul className="divide-y divide-bone/10">
            {team.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{m.name}</p>
                  <p className="truncate text-xs text-mute">{m.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden font-mono text-[11px] text-mute sm:inline">since {formatDate(m.createdAt)}</span>
                  <Badge tone={m.role === "ADMIN" ? "lime" : "neutral"}>{m.role === "ADMIN" ? "Admin" : "Team"}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </DashboardCard>

        {isAdmin ? (
          <DashboardCard title="Add team member" eyebrow="Admin only">
            <TeamMemberForm />
          </DashboardCard>
        ) : null}
      </div>
    </>
  );
}
