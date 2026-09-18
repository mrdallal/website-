import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getClientById } from "@/lib/services/clients";
import { isAppError } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FormMessage } from "@/components/ui/form-field";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { ClientHeaderActions } from "@/components/dashboard/client-header-actions";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Client" };

export default async function ClientDetailPage({ params, searchParams }: PageProps<"/dashboard/clients/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  const query = await searchParams;

  let client;
  try {
    client = await getClientById(id);
  } catch (error) {
    if (isAppError(error) && error.status === 404) notFound();
    throw error;
  }

  const details = [
    { label: "Company", value: client.company ?? "—" },
    { label: "Email", value: client.email ? <a href={`mailto:${client.email}`} className="underline underline-offset-2">{client.email}</a> : "—" },
    {
      label: "Website",
      value: client.website ? (
        <a href={client.website} target="_blank" rel="noreferrer" className="underline underline-offset-2">
          {client.website.replace(/^https?:\/\//, "")}
        </a>
      ) : (
        "—"
      ),
    },
    { label: "Status", value: <StatusBadge status={client.status} /> },
    { label: "Client since", value: formatDate(client.createdAt) },
    {
      label: "Origin",
      value: client.lead ? (
        <Link href={`/dashboard/leads/${client.lead.id}`} className="underline underline-offset-2">
          Lead: {client.lead.name}
        </Link>
      ) : (
        "Added manually"
      ),
    },
  ];

  return (
    <>
      <PageHeader
        backHref="/dashboard/clients"
        backLabel="All clients"
        eyebrow={client.company ?? "Client"}
        title={client.name}
        actions={<ClientHeaderActions clientId={client.id} isAdmin={user.role === "ADMIN"} />}
      />

      {query.created ? <FormMessage tone="success">Client created.</FormMessage> : null}
      {query.updated ? <FormMessage tone="success">Client updated.</FormMessage> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCard title="Details">
          <dl className="divide-y divide-bone/10">
            {details.map((row) => (
              <div key={row.label} className="flex justify-between gap-4 py-2.5 text-sm">
                <dt className="text-mute">{row.label}</dt>
                <dd className="text-right font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>
        </DashboardCard>

        <DashboardCard
          title="Projects"
          eyebrow={`${client.projects.length} total`}
          padded={false}
          className="lg:col-span-2"
          action={
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/projects/new">New project</Link>
            </Button>
          }
        >
          {client.projects.length === 0 ? (
            <div className="p-5">
              <EmptyState compact title="No projects yet." description="Create a project and attach this client to it." />
            </div>
          ) : (
            <ul className="divide-y divide-bone/10">
              {client.projects.map((p) => (
                <li key={p.id}>
                  <Link href={`/dashboard/projects/${p.id}`} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-raised">
                    <span className="text-sm font-semibold">{p.name}</span>
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs text-mute">{formatDate(p.deadline)}</span>
                      <StatusBadge status={p.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard title="Notes" className="lg:col-span-3">
          {client.notes ? <p className="whitespace-pre-wrap text-sm leading-relaxed">{client.notes}</p> : <p className="text-sm text-mute">No notes yet. Add context from the edit page.</p>}
        </DashboardCard>
      </div>
    </>
  );
}
