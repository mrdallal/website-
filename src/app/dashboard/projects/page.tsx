import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { listProjects, type ProjectListItem } from "@/lib/services/projects";
import { projectFilterSchema, projectStatusValues } from "@/lib/validation/project";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { FormMessage, Input, Select } from "@/components/ui/form-field";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { Pagination } from "@/components/dashboard/pagination";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { formatDate, humanize } from "@/lib/utils";

export const metadata: Metadata = { title: "Projects" };

function str(value: string | string[] | undefined) {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export default async function ProjectsPage({ searchParams }: PageProps<"/dashboard/projects">) {
  await requireUser();
  const params = await searchParams;
  const raw = { status: str(params.status), q: str(params.q), page: str(params.page) };
  const parsed = projectFilterSchema.safeParse(raw);
  const filters = parsed.success ? parsed.data : projectFilterSchema.parse({});
  const { items, total, page, pageSize } = await listProjects(filters);
  const hasFilters = Boolean(raw.status || raw.q);

  const columns: DataTableColumn<ProjectListItem>[] = [
    {
      key: "project",
      header: "Project",
      cell: (p) => (
        <Link href={`/dashboard/projects/${p.id}`} className="font-bold hover:underline">
          {p.name}
          {p.category ? <span className="block text-xs font-normal text-mute">{p.category}</span> : null}
        </Link>
      ),
    },
    { key: "client", header: "Client", cell: (p) => (p.client ? p.client.name : <span className="text-mute">—</span>) },
    { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    {
      key: "progress",
      header: "Progress",
      className: "md:w-44",
      cell: (p) =>
        p.progress === null ? (
          <span className="text-xs text-mute">No tasks</span>
        ) : (
          <div className="flex items-center gap-3">
            <ProgressBar value={p.progress} className="flex-1" />
            <span className="font-mono text-xs">{p.progress}%</span>
          </div>
        ),
    },
    {
      key: "deadline",
      header: "Deadline",
      cell: (p) => {
        const overdue = p.deadline && p.status === "ACTIVE" && p.deadline < new Date();
        return <span className={overdue ? "font-mono text-xs font-semibold text-danger" : "font-mono text-xs"}>{formatDate(p.deadline)}</span>;
      },
    },
    { key: "owner", header: "Assigned", cell: (p) => (p.owner ? p.owner.name : <span className="text-mute">Unassigned</span>) },
    {
      key: "actions",
      header: "Actions",
      hideLabel: true,
      align: "right",
      cell: (p) => (
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/projects/${p.id}`}>Open</Link>
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Delivery"
        title="Projects"
        description="Everything in delivery, with progress computed from tasks."
        actions={
          <Button asChild size="sm" withArrow>
            <Link href="/dashboard/projects/new">New project</Link>
          </Button>
        }
      />

      {params.deleted ? <FormMessage tone="success">Project deleted.</FormMessage> : null}

      <div className="space-y-4">
        <form method="get" action="/dashboard/projects" className="grid gap-3 border border-bone/15 bg-surface p-4 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-5">
            <label htmlFor="project-q" className="micro-mono mb-2 block text-mute">
              Search
            </label>
            <Input id="project-q" name="q" defaultValue={raw.q ?? ""} placeholder="Project, category or client" className="h-10" />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="project-status" className="micro-mono mb-2 block text-mute">
              Status
            </label>
            <Select id="project-status" name="status" defaultValue={raw.status ?? ""} className="h-10">
              <option value="">All</option>
              {projectStatusValues.map((s) => (
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
                <Link href="/dashboard/projects">Clear</Link>
              </Button>
            ) : null}
          </div>
        </form>

        <DataTable
          columns={columns}
          rows={items}
          getRowKey={(p) => p.id}
          caption="Projects"
          emptyState={
            hasFilters ? (
              <EmptyState title="No projects match." description="Try a different search or status." />
            ) : (
              <EmptyState
                title="Create your first project."
                description="Projects group tasks, a client and delivery notes. Progress is calculated from completed tasks."
                action={
                  <Button asChild size="sm" withArrow>
                    <Link href="/dashboard/projects/new">New project</Link>
                  </Button>
                }
              />
            )
          }
        />
        <Pagination page={page} pageSize={pageSize} total={total} basePath="/dashboard/projects" query={raw} />
      </div>
    </>
  );
}
