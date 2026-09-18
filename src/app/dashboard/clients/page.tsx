import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { listClients, type ClientListItem } from "@/lib/services/clients";
import { clientFilterSchema, clientStatusValues } from "@/lib/validation/client";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { FormMessage, Input, Select } from "@/components/ui/form-field";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { Pagination } from "@/components/dashboard/pagination";
import { formatDate, humanize } from "@/lib/utils";

export const metadata: Metadata = { title: "Clients" };

function str(value: string | string[] | undefined) {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export default async function ClientsPage({ searchParams }: PageProps<"/dashboard/clients">) {
  await requireUser();
  const params = await searchParams;
  const raw = { status: str(params.status), q: str(params.q), page: str(params.page) };
  const parsed = clientFilterSchema.safeParse(raw);
  const filters = parsed.success ? parsed.data : clientFilterSchema.parse({});
  const { items, total, page, pageSize } = await listClients(filters);
  const hasFilters = Boolean(raw.status || raw.q);

  const columns: DataTableColumn<ClientListItem>[] = [
    {
      key: "name",
      header: "Client",
      cell: (c) => (
        <Link href={`/dashboard/clients/${c.id}`} className="font-bold hover:underline">
          {c.name}
          {c.company ? <span className="block text-xs font-normal text-mute">{c.company}</span> : null}
        </Link>
      ),
    },
    { key: "email", header: "Email", cell: (c) => c.email ?? <span className="text-mute">—</span> },
    { key: "status", header: "Status", cell: (c) => <StatusBadge status={c.status} /> },
    { key: "projects", header: "Projects", cell: (c) => <span className="font-mono text-xs">{c._count.projects}</span> },
    { key: "created", header: "Since", cell: (c) => <span className="font-mono text-xs">{formatDate(c.createdAt)}</span> },
    {
      key: "actions",
      header: "Actions",
      hideLabel: true,
      align: "right",
      cell: (c) => (
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/clients/${c.id}`}>Open</Link>
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Relationships"
        title="Clients"
        description="Clients are created manually or by converting a won lead."
        actions={
          <Button asChild size="sm" withArrow>
            <Link href="/dashboard/clients/new">New client</Link>
          </Button>
        }
      />

      {params.deleted ? <FormMessage tone="success">Client deleted.</FormMessage> : null}

      <div className="space-y-4">
        <form method="get" action="/dashboard/clients" className="grid gap-3 border border-bone/15 bg-surface p-4 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-5">
            <label htmlFor="client-q" className="micro-mono mb-2 block text-mute">
              Search
            </label>
            <Input id="client-q" name="q" defaultValue={raw.q ?? ""} placeholder="Name, company or email" className="h-10" />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="client-status" className="micro-mono mb-2 block text-mute">
              Status
            </label>
            <Select id="client-status" name="status" defaultValue={raw.status ?? ""} className="h-10">
              <option value="">All</option>
              {clientStatusValues.map((s) => (
                <option key={s} value={s}>
                  {humanize(s)}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex gap-2 sm:col-span-4">
            <Button type="submit" size="sm" className="h-10 flex-1">
              Apply
            </Button>
            {hasFilters ? (
              <Button asChild variant="ghost" size="sm" className="h-10">
                <Link href="/dashboard/clients">Clear</Link>
              </Button>
            ) : null}
          </div>
        </form>

        <DataTable
          columns={columns}
          rows={items}
          getRowKey={(c) => c.id}
          caption="Clients"
          emptyState={
            hasFilters ? (
              <EmptyState title="No clients match." description="Try a different search or status." />
            ) : (
              <EmptyState
                title="No clients yet."
                description="Convert a won lead into a client, or add one manually."
                action={
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" withArrow>
                      <Link href="/dashboard/clients/new">Add client</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/dashboard/leads">Go to leads</Link>
                    </Button>
                  </div>
                }
              />
            )
          }
        />
        <Pagination page={page} pageSize={pageSize} total={total} basePath="/dashboard/clients" query={raw} />
      </div>
    </>
  );
}
