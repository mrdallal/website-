"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/form-field";
import { StatusBadge } from "@/components/ui/status-badge";
import { TaskFormDialog } from "@/components/dashboard/task-form";
import { deleteTaskAction, moveTaskAction } from "@/app/dashboard/tasks/actions";
import { taskStatusValues } from "@/lib/validation/task";
import type { Option, TaskItem } from "@/types/dashboard";
import { formatDate, humanize } from "@/lib/utils";

interface TaskListProps {
  tasks: TaskItem[];
  projects: Option[];
  team: Option[];
  showProject?: boolean;
}

export function TaskList({ tasks, projects, team, showProject = false }: TaskListProps) {
  const [pending, startTransition] = React.useTransition();
  const [deleting, setDeleting] = React.useState<TaskItem | null>(null);

  const move = (task: TaskItem, status: string) => {
    startTransition(async () => {
      const result = await moveTaskAction(task.id, status);
      if (!result.ok) toast.error(result.message);
    });
  };

  const remove = () => {
    if (!deleting) return;
    startTransition(async () => {
      const result = await deleteTaskAction(deleting.id);
      if (result.ok) toast.success("Task deleted.");
      else toast.error(result.message);
      setDeleting(null);
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          compact
          title="No tasks yet."
          description="Break the work into tasks to track progress. Progress is calculated from completed tasks."
          action={projects.length > 0 ? <TaskFormDialog projects={projects} team={team} defaultProjectId={projects[0]?.id} triggerLabel="Create first task" /> : undefined}
        />
      </div>
    );
  }

  const groups = taskStatusValues.map((status) => ({ status, items: tasks.filter((t) => t.status === status) })).filter((g) => g.items.length > 0);

  return (
    <>
      <div className="divide-y divide-bone/10">
        {groups.map((group) => (
          <section key={group.status} aria-label={humanize(group.status)}>
            <div className="flex items-center gap-3 bg-raised/60 px-5 py-2">
              <StatusBadge status={group.status} />
              <span className="font-mono text-xs text-mute">{group.items.length}</span>
            </div>
            <ul className="divide-y divide-bone/10">
              {group.items.map((task) => {
                const overdue = task.dueDate && task.status !== "DONE" && task.dueDate < new Date();
                return (
                  <li key={task.id} className="grid gap-3 px-5 py-3 md:grid-cols-12 md:items-center">
                    <div className="min-w-0 md:col-span-5">
                      <p className={task.status === "DONE" ? "text-sm font-semibold text-mute line-through" : "text-sm font-semibold"}>{task.title}</p>
                      <p className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-mute">
                        {showProject ? (
                          <Link href={`/dashboard/projects/${task.project.id}?tab=tasks`} className="underline underline-offset-2">
                            {task.project.name}
                          </Link>
                        ) : null}
                        {task.assignee ? <span>· {task.assignee.name}</span> : <span>· Unassigned</span>}
                        {task.dueDate ? <span className={overdue ? "font-semibold text-danger" : ""}>· Due {formatDate(task.dueDate)}</span> : null}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <StatusBadge status={task.priority} />
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor={`task-status-${task.id}`} className="sr-only">
                        Status for {task.title}
                      </label>
                      <Select id={`task-status-${task.id}`} value={task.status} disabled={pending} onChange={(e) => move(task, e.target.value)} className="h-9 text-sm">
                        {taskStatusValues.map((s) => (
                          <option key={s} value={s}>
                            {humanize(s)}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex items-center justify-end gap-1 md:col-span-2">
                      <TaskFormDialog projects={projects} team={team} task={task} />
                      <Button size="iconSm" variant="ghost" aria-label={`Delete ${task.title}`} disabled={pending} onClick={() => setDeleting(task)}>
                        <Trash2 className="size-4 text-danger" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this task?"
        description={deleting ? `"${deleting.title}" will be removed permanently.` : undefined}
        confirmLabel="Delete task"
        destructive
        loading={pending}
        onConfirm={remove}
      />
    </>
  );
}
