import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { listTasks } from "@/lib/services/tasks";
import { listProjectOptions } from "@/lib/services/projects";
import { listTeamMembers } from "@/lib/services/users";
import { taskFilterSchema, taskPriorityValues, taskStatusValues } from "@/lib/validation/task";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/form-field";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { TaskBoard } from "@/components/dashboard/task-board";
import { TaskList } from "@/components/dashboard/task-list";
import { TaskFormDialog } from "@/components/dashboard/task-form";
import { cn, humanize } from "@/lib/utils";

export const metadata: Metadata = { title: "Tasks" };

function str(value: string | string[] | undefined) {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export default async function TasksPage({ searchParams }: PageProps<"/dashboard/tasks">) {
  await requireUser();
  const params = await searchParams;
  const view = str(params.view) === "list" ? "list" : "board";
  const raw = { projectId: str(params.projectId), status: str(params.status), priority: str(params.priority), assigneeId: str(params.assigneeId) };
  const parsed = taskFilterSchema.safeParse(raw);
  const filters = parsed.success ? parsed.data : {};

  const [tasks, projects, team] = await Promise.all([listTasks(filters), listProjectOptions(), listTeamMembers()]);
  const teamOptions = team.map((m) => ({ id: m.id, name: m.name }));
  const hasFilters = Object.values(raw).some(Boolean);

  const viewHref = (v: "board" | "list") => {
    const p = new URLSearchParams();
    for (const [k, val] of Object.entries(raw)) if (val) p.set(k, val);
    p.set("view", v);
    return `/dashboard/tasks?${p.toString()}`;
  };

  return (
    <>
      <PageHeader
        eyebrow="Delivery"
        title="Tasks"
        description="Every task belongs to a project. Drag cards between columns or switch to the list view."
        actions={
          <>
            <div className="inline-flex border border-bone/20" role="group" aria-label="View">
              <Link href={viewHref("board")} className={cn("px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em]", view === "board" ? "bg-ink text-bone" : "hover:bg-raised")} aria-current={view === "board" ? "page" : undefined}>
                Board
              </Link>
              <Link href={viewHref("list")} className={cn("px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em]", view === "list" ? "bg-ink text-bone" : "hover:bg-raised")} aria-current={view === "list" ? "page" : undefined}>
                List
              </Link>
            </div>
            <TaskFormDialog projects={projects} team={teamOptions} defaultProjectId={raw.projectId} />
          </>
        }
      />

      <form method="get" action="/dashboard/tasks" className="mb-4 grid gap-3 border border-bone/15 bg-surface p-4 md:grid-cols-12 md:items-end">
        <input type="hidden" name="view" value={view} />
        <div className="md:col-span-3">
          <label htmlFor="task-project" className="micro-mono mb-2 block text-mute">Project</label>
          <Select id="task-project" name="projectId" defaultValue={raw.projectId ?? ""} className="h-10">
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="task-status" className="micro-mono mb-2 block text-mute">Status</label>
          <Select id="task-status" name="status" defaultValue={raw.status ?? ""} className="h-10">
            <option value="">All</option>
            {taskStatusValues.map((s) => (
              <option key={s} value={s}>{humanize(s)}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="task-priority" className="micro-mono mb-2 block text-mute">Priority</label>
          <Select id="task-priority" name="priority" defaultValue={raw.priority ?? ""} className="h-10">
            <option value="">All</option>
            {taskPriorityValues.map((p) => (
              <option key={p} value={p}>{humanize(p)}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-3">
          <label htmlFor="task-assignee" className="micro-mono mb-2 block text-mute">Assignee</label>
          <Select id="task-assignee" name="assigneeId" defaultValue={raw.assigneeId ?? ""} className="h-10">
            <option value="">Anyone</option>
            {teamOptions.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </Select>
        </div>
        <div className="flex gap-2 md:col-span-2">
          <Button type="submit" size="sm" className="h-10 flex-1">Apply</Button>
          {hasFilters ? (
            <Button asChild variant="ghost" size="sm" className="h-10">
              <Link href={`/dashboard/tasks?view=${view}`}>Clear</Link>
            </Button>
          ) : null}
        </div>
      </form>

      {projects.length === 0 && tasks.length === 0 ? (
        <EmptyState
          title="Create a project before adding tasks."
          description="Tasks live inside projects so progress can be tracked per engagement."
          action={
            <Button asChild size="sm" withArrow>
              <Link href="/dashboard/projects/new">New project</Link>
            </Button>
          }
        />
      ) : view === "board" ? (
        <TaskBoard tasks={tasks} projects={projects} team={teamOptions} />
      ) : (
        <DashboardCard padded={false}>
          <TaskList tasks={tasks} projects={projects} team={teamOptions} showProject />
        </DashboardCard>
      )}
    </>
  );
}
