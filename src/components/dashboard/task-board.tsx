"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { TaskFormDialog } from "@/components/dashboard/task-form";
import { moveTaskAction } from "@/app/dashboard/tasks/actions";
import { taskStatusValues } from "@/lib/validation/task";
import type { Option, TaskItem } from "@/types/dashboard";
import { cn, formatDate, humanize } from "@/lib/utils";

interface TaskBoardProps {
  tasks: TaskItem[];
  projects: Option[];
  team: Option[];
}

/**
 * Kanban board. Cards move via native drag-and-drop or the keyboard-accessible
 * arrow buttons; moves are optimistic and reconciled by the server action.
 */
export function TaskBoard({ tasks, projects, team }: TaskBoardProps) {
  const [optimistic, setOptimistic] = React.useState<Record<string, string>>({});
  const [pending, startTransition] = React.useTransition();
  const [dragOver, setDragOver] = React.useState<string | null>(null);

  const statusOf = (task: TaskItem) => optimistic[task.id] ?? task.status;

  const move = (task: TaskItem, status: string) => {
    if (statusOf(task) === status) return;
    setOptimistic((prev) => ({ ...prev, [task.id]: status }));
    startTransition(async () => {
      const result = await moveTaskAction(task.id, status);
      if (!result.ok) {
        toast.error(result.message);
        setOptimistic((prev) => {
          const next = { ...prev };
          delete next[task.id];
          return next;
        });
      }
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {taskStatusValues.map((status, colIndex) => {
        const items = tasks.filter((t) => statusOf(t) === status);
        return (
          <section
            key={status}
            aria-label={humanize(status)}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(status);
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/task-id");
              const task = tasks.find((t) => t.id === id);
              if (task) move(task, status);
              setDragOver(null);
            }}
            className={cn(
              "flex min-h-72 flex-col border bg-surface transition-colors",
              dragOver === status ? "border-bone/30 bg-canvas" : "border-bone/15",
            )}
          >
            <header className="flex items-center justify-between border-b border-bone/10 px-4 py-3">
              <StatusBadge status={status} />
              <span className="font-mono text-xs text-mute">{items.length}</span>
            </header>
            <ul className="flex flex-1 flex-col gap-2 p-3">
              {items.length === 0 ? (
                <li className="flex flex-1 items-center justify-center border border-dashed border-bone/15 p-4 text-center text-xs text-mute">
                  {status === "TODO" ? "Nothing queued." : "Drop a task here."}
                </li>
              ) : null}
              {items.map((task) => {
                const overdue = task.dueDate && status !== "DONE" && task.dueDate < new Date();
                return (
                  <li
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/task-id", task.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    className={cn("cursor-grab border border-bone/15 bg-canvas p-3 active:cursor-grabbing", pending && optimistic[task.id] && "opacity-60")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-semibold", status === "DONE" && "text-mute line-through")}>{task.title}</p>
                      <StatusBadge status={task.priority} label={task.priority === "HIGH" ? "High" : task.priority === "LOW" ? "Low" : "Med"} className="shrink-0" />
                    </div>
                    <p className="mt-1.5 text-xs text-mute">
                      <Link href={`/dashboard/projects/${task.project.id}?tab=tasks`} className="underline underline-offset-2">
                        {task.project.name}
                      </Link>
                      {task.assignee ? ` · ${task.assignee.name}` : ""}
                    </p>
                    {task.dueDate ? (
                      <p className={cn("mt-1 font-mono text-[11px]", overdue ? "font-semibold text-danger" : "text-mute")}>Due {formatDate(task.dueDate)}</p>
                    ) : null}
                    <div className="mt-3 flex items-center justify-between border-t border-bone/10 pt-2">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          aria-label={`Move ${task.title} to ${colIndex > 0 ? humanize(taskStatusValues[colIndex - 1]!) : "previous"}`}
                          disabled={colIndex === 0 || pending}
                          onClick={() => move(task, taskStatusValues[colIndex - 1]!)}
                          className="inline-flex size-7 items-center justify-center border border-bone/15 hover:bg-ink hover:text-bone disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
                        >
                          <ChevronLeft className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Move ${task.title} to ${colIndex < taskStatusValues.length - 1 ? humanize(taskStatusValues[colIndex + 1]!) : "next"}`}
                          disabled={colIndex === taskStatusValues.length - 1 || pending}
                          onClick={() => move(task, taskStatusValues[colIndex + 1]!)}
                          className="inline-flex size-7 items-center justify-center border border-bone/15 hover:bg-ink hover:text-bone disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
                        >
                          <ChevronRight className="size-3.5" />
                        </button>
                      </div>
                      <TaskFormDialog projects={projects} team={team} task={task} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
