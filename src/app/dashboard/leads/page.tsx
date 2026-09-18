import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getLeadSources, listLeads } from "@/lib/services/leads";
import { leadFilterSchema } from "@/lib/validation/lead";
import { serviceLabel } from "@/content/lead-options";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { FormMessage } from "@/components/ui/form-field";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { LeadFilters } from "@/components/dashboard/lead-filters";
import { Pagination } from "@/components/dashboard/pagination";
import { formatDate } from "@/lib/utils";
import type { Lead } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Leads" };

function str(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export default async function LeadsPage({ searchParams }: PageProps<"/dashboard/leads">) {
  await requireUser();
  const params = await searchParams;
  const raw = {
    status: str(params.status),
    service: str(params.service),
    source: str(params.source),
    q: str(params.q),
    from: str(params.from),
    to: str(params.to),
    page: str(params.page),
  };
  const parsed = leadFilterSchema.safeParse(raw);
  const filters = parsed.success ? parsed.data : leadFilterSchema.parse({});
  const [{ items, total, page, pageSize }, sources] = await Promise.all([listLeads(filters), getLeadSources()]);
  const hasFilters = Boolean(raw.status || raw.service || raw.source || raw.q || raw.from || raw.to);

  const columns: DataTableColumn<Lead>[] = [
    {
      key: "name",
      header: "Name",
      cell: (lead) => (
        <Link href={`/dashboard/leads/${lead.id}`} className="font-bold hover:underline">
          {lead.name}
          <span className="block text-xs font-normal text-mute">{lead.email}</span>
        </Link>
      ),
    },
    { key: "company", header: "Company", cell: (lead) => lead.company ?? <span className="text-mute">—</span> },
    { key: "service", header: "Service", cell: (lead) => serviceLabel(lead.service) ?? <span className="text-mute">—</span> },
    { key: "status", header: "Status", cell: (lead) => <StatusBadge status={lead.status} /> },
    { key: "source", header: "Source", cell: (lead) => <span className="font-mono text-xs">{lead.source}</span> },
    { key: "created", header: "Created", cell: (lead) => <span className="font-mono text-xs">{formatDate(lead.createdAt)}</span> },
    {
      key: "actions",
      header: "Actions",
      hideLabel: true,
      align: "right",
      cell: (lead) => (
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/leads/${lead.id}`}>Open</Link>
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Pipeline"
        title="Leads"
        description="Every submission from the website lands here with a unique ID. Filter, qualify and move leads through the pipeline."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/contact" target="_blank" rel="noreferrer">
              Open public form
            </Link>
          </Button>
        }
      />

      {params.deleted ? <FormMessage tone="success">Lead deleted.</FormMessage> : null}

      <div className="space-y-4">
        <LeadFilters values={raw} sources={sources} />
        <DataTable
          columns={columns}
          rows={items}
          getRowKey={(lead) => lead.id}
          caption="Leads"
          emptyState={
            hasFilters ? (
              <EmptyState
                title="No leads match these filters."
                description="Try widening the date range or clearing the filters."
                action={
                  <Button asChild size="sm" variant="outline">
                    <Link href="/dashboard/leads">Clear filters</Link>
                  </Button>
                }
              />
            ) : (
              <EmptyState
                title="No leads yet."
                description="Your first lead will appear here once someone submits the project form on the website."
                action={
                  <Button asChild size="sm" variant="outline" withArrow>
                    <Link href="/contact" target="_blank" rel="noreferrer">
                      Test the form
                    </Link>
                  </Button>
                }
              />
            )
          }
        />
        <Pagination page={page} pageSize={pageSize} total={total} basePath="/dashboard/leads" query={raw} />
      </div>
    </>
  );
}
