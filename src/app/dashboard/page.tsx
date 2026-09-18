import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getDashboardStats } from "@/lib/services/stats";
import { serviceLabel } from "@/content/lead-options";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FormMessage } from "@/components/ui/form-field";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatBlock } from "@/components/dashboard/stat-block";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { formatDate, formatRelative, humanize } from "@/lib/utils";

const pipelineOrder = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"] as const;

export default async function DashboardOverviewPage({ searchParams }: PageProps<"/dashboard">) {
  const user = await requireUser();
  const params = await searchParams;
  const stats = await getDashboardStats();
  const firstName = user.name.split(" ")[0] ?? user.name;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title={`${greeting}, ${firstName}.`}
        description={
          stats.totalLeads === 0
            ? "The system is live. Your first lead will appear here once someone submits the project form."
            : `${stats.leadsThisWeek} new ${stats.leadsThisWeek === 1 ? "lead" : "leads"} in the last 7 days.`
        }
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/projects/new">New project</Link>
            </Button>
            <Button asChild size="sm" withArrow>
              <Link href="/dashboard/leads">Open leads</Link>
            </Button>
          </>
        }
      />

      {params.forbidden ? <FormMessage tone="error">That area is limited to admins.</FormMessage> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatBlock label="New leads" value={stats.newLeads} hint="Awaiting first contact" href="/dashboard/leads?status=NEW" accent />
        <StatBlock label="Active projects" value={stats.activeProjects} hint="In delivery" href="/dashboard/projects?status=ACTIVE" />
        <StatBlock
          label="Open tasks"
          value={stats.openTasks}
          hint={stats.overdueTasks > 0 ? `${stats.overdueTasks} overdue` : "Nothing overdue"}
          href="/dashboard/tasks"
        />
        <StatBlock
          label="Conversion rate"
          value={stats.conversionRate === null ? null : `${stats.conversionRate}%`}
          hint={stats.conversionRate === null ? "Won ÷ closed leads, once leads are closed" : `${stats.wonLeads} won · ${stats.lostLeads} lost`}
          href="/dashboard/analytics"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <DashboardCard
          title="Pipeline"
          eyebrow="Leads by status"
          className="xl:col-span-1"
          action={
            <Link href="/dashboard/leads" className="text-xs font-semibold underline underline-offset-2">
              View all
            </Link>
          }
        >
          {stats.totalLeads === 0 ? (
            <EmptyState compact title="No leads yet." description="Your first lead will appear here once someone submits the project form." />
          ) : (
            <ul className="divide-y divide-bone/10">
              {pipelineOrder.map((status) => {
                const count = stats.pipeline.find((p) => p.status === status)?.count ?? 0;
                const pct = stats.totalLeads ? Math.round((count / stats.totalLeads) * 100) : 0;
                return (
                  <li key={status} className="py-2.5">
                    <Link href={`/dashboard/leads?status=${status}`} className="flex items-center justify-between gap-3 text-sm hover:underline">
                      <span className="flex items-center gap-2">
                        <StatusBadge status={status} />
                      </span>
                      <span className="font-mono text-xs text-mute">
                        {count} · {pct}%
                      </span>
                    </Link>
                    <div className="mt-2 h-1 w-full bg-raised">
                      <div className="h-1 bg-ink" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard
          title="Recent leads"
          eyebrow="Latest submissions"
          padded={false}
          className="xl:col-span-2"
          action={
            <Link href="/dashboard/leads" className="text-xs font-semibold underline underline-offset-2">
              All leads
            </Link>
          }
        >
          {stats.recentLeads.length === 0 ? (
            <div className="p-5">
              <EmptyState
                compact
                title="No leads yet."
                description="Share the contact page or test the form to see a lead flow through the system."
                action={
                  <Button asChild size="sm" variant="outline" withArrow>
                    <Link href="/contact" target="_blank" rel="noreferrer">
                      Open contact form
                    </Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <ul className="divide-y divide-bone/10">
              {stats.recentLeads.map((lead) => (
                <li key={lead.id}>
                  <Link href={`/dashboard/leads/${lead.id}`} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-raised">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{lead.name}</p>
                      <p className="truncate text-xs text-mute">
                        {lead.company ?? lead.email}
                        {lead.service ? ` · ${serviceLabel(lead.service)}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StatusBadge status={lead.status} />
                      <span className="hidden font-mono text-xs text-mute sm:inline">{formatRelative(lead.createdAt)}</span>
                      <ArrowRight className="size-4 text-mute" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard title="Upcoming tasks" eyebrow="By due date" padded={false} className="xl:col-span-1">
          {stats.upcomingTasks.length === 0 ? (
            <div className="p-5">
              <EmptyState compact title="No dated tasks." description="Tasks with a due date will be listed here." />
            </div>
          ) : (
            <ul className="divide-y divide-bone/10">
              {stats.upcomingTasks.map((task) => {
                const overdue = task.dueDate && task.dueDate < new Date();
                return (
                  <li key={task.id} className="px-5 py-3">
                    <Link href={`/dashboard/projects/${task.project.id}`} className="block hover:underline">
                      <p className="text-sm font-semibold">{task.title}</p>
                      <p className="mt-1 text-xs text-mute">
                        {task.project.name} · {humanize(task.status)}
                        {task.assignee ? ` · ${task.assignee.name}` : ""}
                      </p>
                      <p className={overdue ? "mt-1 text-xs font-semibold text-danger" : "mt-1 text-xs text-mute"}>
                        Due {formatDate(task.dueDate)}
                        {overdue ? " · overdue" : ""}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard title="Activity" eyebrow="Recent events" className="xl:col-span-2">
          <ActivityFeed items={stats.recentActivity} />
        </DashboardCard>
      </div>
    </>
  );
}
