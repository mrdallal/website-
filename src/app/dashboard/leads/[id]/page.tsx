import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getLeadById } from "@/lib/services/leads";
import { isAppError } from "@/lib/errors";
import { budgetLabel, serviceLabel, timelineLabel } from "@/content/lead-options";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { LeadStatusActions } from "@/components/dashboard/lead-status-actions";
import { LeadNoteForm } from "@/components/dashboard/lead-note-form";
import { LeadNotesEditor } from "@/components/dashboard/lead-notes-editor";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Lead" };

export default async function LeadDetailPage({ params }: PageProps<"/dashboard/leads/[id]">) {
  const user = await requireUser();
  const { id } = await params;

  let lead;
  try {
    lead = await getLeadById(id);
  } catch (error) {
    if (isAppError(error) && error.status === 404) notFound();
    throw error;
  }

  const contact = [
    { label: "Email", value: <a href={`mailto:${lead.email}`} className="underline underline-offset-2">{lead.email}</a> },
    { label: "Company", value: lead.company ?? "—" },
    {
      label: "Website",
      value: lead.website ? (
        <a href={lead.website} target="_blank" rel="noreferrer" className="underline underline-offset-2">
          {lead.website.replace(/^https?:\/\//, "")}
        </a>
      ) : (
        "—"
      ),
    },
    { label: "Source", value: <span className="font-mono text-xs">{lead.source}</span> },
  ];

  const request = [
    { label: "Service", value: serviceLabel(lead.service) ?? "—" },
    { label: "Budget", value: budgetLabel(lead.budget) ?? "—" },
    { label: "Timeline", value: timelineLabel(lead.timeline) ?? "—" },
    { label: "Submitted", value: formatDate(lead.createdAt, { dateStyle: "medium", timeStyle: "short" }) },
  ];

  return (
    <>
      <PageHeader
        backHref="/dashboard/leads"
        backLabel="All leads"
        eyebrow={`Lead · ${lead.id}`}
        title={lead.name}
        description={lead.company ? `${lead.company} · ${lead.email}` : lead.email}
        actions={<StatusBadge status={lead.status} className="text-xs" />}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <DashboardCard title="Status" eyebrow="Pipeline">
            <LeadStatusActions leadId={lead.id} status={lead.status} converted={Boolean(lead.client)} isAdmin={user.role === "ADMIN"} />
            {lead.client ? (
              <p className="mt-4 text-xs text-mute">
                Converted to client{" "}
                <Link href={`/dashboard/clients/${lead.client.id}`} className="underline underline-offset-2">
                  {lead.client.name}
                </Link>
                .
              </p>
            ) : null}
          </DashboardCard>

          <div className="grid gap-6 md:grid-cols-2">
            <DashboardCard title="Contact information">
              <dl className="divide-y divide-bone/10">
                {contact.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 py-2.5 text-sm">
                    <dt className="text-mute">{row.label}</dt>
                    <dd className="text-right font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </DashboardCard>
            <DashboardCard title="Project request">
              <dl className="divide-y divide-bone/10">
                {request.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 py-2.5 text-sm">
                    <dt className="text-mute">{row.label}</dt>
                    <dd className="text-right font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </DashboardCard>
          </div>

          <DashboardCard title="Message" eyebrow="From the form">
            {lead.message ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{lead.message}</p>
            ) : (
              <p className="text-sm text-mute">No message was included.</p>
            )}
          </DashboardCard>

          <DashboardCard title="Internal notes" eyebrow="Visible to the team only">
            <LeadNotesEditor leadId={lead.id} notes={lead.notes ?? ""} />
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Add a note" eyebrow="Timeline entry">
            <LeadNoteForm leadId={lead.id} />
          </DashboardCard>
          <DashboardCard title="Activity history" eyebrow="Timeline">
            <ActivityFeed
              items={lead.activities}
              showContext={false}
              emptyTitle="No activity yet."
              emptyDescription="Status changes, notes and integration events will appear here."
            />
          </DashboardCard>
        </div>
      </div>
    </>
  );
}
