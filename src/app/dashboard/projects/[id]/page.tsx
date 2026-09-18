import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getProjectById } from "@/lib/services/projects";
import { listProjectOptions } from "@/lib/services/projects";
import { listTeamMembers } from "@/lib/services/users";
import { isAppError } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FormMessage } from "@/components/ui/form-field";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { ProjectHeaderActions } from "@/components/dashboard/project-header-actions";
import { ProjectNotesEditor } from "@/components/dashboard/project-notes-editor";
import { TaskFormDialog } from "@/components/dashboard/task-form";
import { TaskList } from "@/components/dashboard/task-list";
import { formatDate, humanize } from "@/lib/utils";

export const metadata: Metadata = { title: "Project" };

export default async function ProjectDetailPage({ params, searchParams }: PageProps<"/dashboard/projects/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  const query = await searchParams;

  let project;
  try {
    project = await getProjectById(id);
  } catch (error) {
    if (isAppError(error) && error.status === 404) notFound();
    throw error;
  }
  const [team, projectOptions] = await Promise.all([listTeamMembers(), listProjectOptions()]);
  const teamOptions = team.map((m) => ({ id: m.id, name: m.name }));

  const counts = {
    total: project.tasks.length,
    done: project.tasks.filter((t) => t.status === "DONE").length,
    inProgress: project.tasks.filter((t) => t.status === "IN_PROGRESS").length,
    review: project.tasks.filter((t) => t.status === "REVIEW").length,
  };

  const timeline = [
    { label: "Project created", date: project.createdAt, tone: "ink" },
    ...project.tasks
      .filter((t) => t.dueDate)
      .map((t) => ({ label: `Task due: ${t.title}`, date: t.dueDate as Date, tone: t.status === "DONE" ? "muted" : "neutral" })),
    ...(project.deadline ? [{ label: "Deadline", date: project.deadline, tone: "lime" }] : []),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  const meta = [
    { label: "Status", value: <StatusBadge status={project.status} /> },
    { label: "Category", value: project.category ?? "—" },
    { label: "Deadline", value: formatDate(project.deadline) },
    { label: "Owner", value: project.owner?.name ?? "Unassigned" },
    { label: "Client", value: project.client ? <Link href={`/dashboard/clients/${project.client.id}`} className="underline underline-offset-2">{project.client.name}</Link> : "—" },
    { label: "Featured", value: project.featured ? "Yes" : "No" },
    { label: "Slug", value: <span className="font-mono text-xs">{project.slug}</span> },
    { label: "Updated", value: formatDate(project.updatedAt) },
  ];

  return (
    <>
      <PageHeader
        backHref="/dashboard/projects"
        backLabel="All projects"
        eyebrow={project.client ? `${project.client.name}${project.category ? ` · ${project.category}` : ""}` : project.category ?? "Project"}
        title={project.name}
        description={project.description ?? undefined}
        actions={<ProjectHeaderActions projectId={project.id} status={project.status} isAdmin={user.role === "ADMIN"} />}
      />

      {query.created ? <FormMessage tone="success">Project created.</FormMessage> : null}
      {query.updated ? <FormMessage tone="success">Project updated.</FormMessage> : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="border border-bone/15 bg-surface p-4 sm:col-span-2">
          <div className="flex items-center justify-between">
            <p className="micro-mono text-mute">Progress</p>
            <p className="font-mono text-xs">{project.progress === null ? "No tasks yet" : `${project.progress}%`}</p>
          </div>
          <ProgressBar value={project.progress ?? 0} className="mt-3" />
        </div>
        <div className="border border-bone/15 bg-surface p-4">
          <p className="micro-mono text-mute">Tasks</p>
          <p className="mt-2 font-mono text-2xl">
            {counts.done}/{counts.total}
          </p>
          <p className="text-xs text-mute">done</p>
        </div>
        <div className="border border-bone/15 bg-surface p-4">
          <p className="micro-mono text-mute">In flight</p>
          <p className="mt-2 font-mono text-2xl">{counts.inProgress + counts.review}</p>
          <p className="text-xs text-mute">in progress or review</p>
        </div>
      </div>

      <Tabs defaultValue={typeof query.tab === "string" ? query.tab : "overview"}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({counts.total})</TabsTrigger>
          <TabsTrigger value="client">Client</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-3">
            <DashboardCard title="Description" className="lg:col-span-2">
              {project.description ? <p className="whitespace-pre-wrap text-sm leading-relaxed">{project.description}</p> : <p className="text-sm text-mute">No description yet.</p>}
            </DashboardCard>
            <DashboardCard title="Details">
              <dl className="divide-y divide-bone/10">
                {meta.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 py-2.5 text-sm">
                    <dt className="text-mute">{row.label}</dt>
                    <dd className="text-right font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <DashboardCard
            title="Tasks"
            eyebrow="Grouped by status"
            padded={false}
            action={<TaskFormDialog projects={projectOptions} team={teamOptions} defaultProjectId={project.id} triggerLabel="New task" />}
          >
            <TaskList tasks={project.tasks.map((t) => ({ ...t, project: { id: project.id, name: project.name } }))} projects={projectOptions} team={teamOptions} />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="client">
          {project.client ? (
            <DashboardCard title={project.client.name} eyebrow="Client">
              <dl className="divide-y divide-bone/10">
                <div className="flex justify-between gap-4 py-2.5 text-sm"><dt className="text-mute">Company</dt><dd className="font-medium">{project.client.company ?? "—"}</dd></div>
                <div className="flex justify-between gap-4 py-2.5 text-sm"><dt className="text-mute">Email</dt><dd className="font-medium">{project.client.email ?? "—"}</dd></div>
                <div className="flex justify-between gap-4 py-2.5 text-sm"><dt className="text-mute">Status</dt><dd><StatusBadge status={project.client.status} /></dd></div>
              </dl>
              <Button asChild size="sm" variant="outline" className="mt-4">
                <Link href={`/dashboard/clients/${project.client.id}`}>Open client</Link>
              </Button>
            </DashboardCard>
          ) : (
            <EmptyState
              title="No client attached."
              description="Attach a client so this project shows up on their record."
              action={
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/projects/${project.id}/edit`}>Edit project</Link>
                </Button>
              }
            />
          )}
        </TabsContent>

        <TabsContent value="files">
          <EmptyState
            title="File storage is not connected yet."
            description="This is a placeholder for briefs, designs and deliverables. Connect a storage provider (S3, Vercel Blob, Drive) to enable uploads here."
          />
        </TabsContent>

        <TabsContent value="notes">
          <DashboardCard title="Internal notes" eyebrow="Team only">
            <ProjectNotesEditor projectId={project.id} notes={project.notes ?? ""} />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="activity">
          <DashboardCard title="Activity" eyebrow="Latest 30 events">
            <ActivityFeed items={project.activities} showContext={false} emptyDescription="Project and task changes will appear here." />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="timeline">
          <DashboardCard title="Timeline" eyebrow="Key dates">
            <ol className="divide-y divide-bone/10">
              {timeline.map((item, i) => (
                <li key={`${item.label}-${i}`} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="flex items-center gap-3">
                    <span aria-hidden="true" className={item.tone === "lime" ? "size-2 bg-lime" : item.tone === "muted" ? "size-2 bg-ash" : "size-2 bg-ink"} />
                    {item.label}
                  </span>
                  <span className="font-mono text-xs text-mute">{formatDate(item.date)}</span>
                </li>
              ))}
            </ol>
            {!project.deadline ? <p className="mt-4 text-xs text-mute">No deadline set. Add one from {humanize("edit project").toLowerCase()}.</p> : null}
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </>
  );
}
