"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField, FormMessage, Input, Select, Textarea } from "@/components/ui/form-field";
import { createTaskAction, updateTaskAction } from "@/app/dashboard/tasks/actions";
import { taskPriorityValues, taskStatusValues } from "@/lib/validation/task";
import type { ActionResult } from "@/lib/actions";
import type { Option, TaskItem } from "@/types/dashboard";
import { humanize, toDateInputValue } from "@/lib/utils";

interface TaskFormDialogProps {
  projects: Option[];
  team: Option[];
  /** Existing task to edit; omit to create */
  task?: TaskItem;
  defaultProjectId?: string;
  defaultStatus?: string;
  triggerLabel?: string;
  trigger?: React.ReactNode;
}

/**
 * Create/edit task in an accessible dialog. Server Action handles validation;
 * the dialog closes and toasts on success.
 */
export function TaskFormDialog({ projects, team, task, defaultProjectId, defaultStatus, triggerLabel = "New task", trigger }: TaskFormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const action = task ? updateTaskAction : createTaskAction;
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(async (prev, formData) => {
    const result = await action(prev, formData);
    if (result.ok) {
      toast.success(result.message ?? "Saved.");
      setOpen(false);
    } else if (!result.fieldErrors) {
      toast.error(result.message);
    }
    return result;
  }, null);
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant={task ? "ghost" : "primary"}>
            {task ? "Edit" : <><Plus className="size-4" /> {triggerLabel}</>}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>{task ? "Update the task details." : "Tasks belong to a project and can be assigned to a team member."}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-5">
          {state && !state.ok && !state.fieldErrors ? <FormMessage tone="error">{state.message}</FormMessage> : null}
          {task ? <input type="hidden" name="taskId" value={task.id} /> : null}

          <FormField label="Title" name="title" required error={errors.title}>
            <Input defaultValue={task?.title ?? ""} placeholder="e.g. Wire lead form to CRM" autoFocus />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Project" name="projectId" required optionalLabel={false} error={errors.projectId}>
              <Select defaultValue={task?.projectId ?? defaultProjectId ?? projects[0]?.id ?? ""}>
                {projects.length === 0 ? <option value="">Create a project first</option> : null}
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Assignee" name="assigneeId" error={errors.assigneeId}>
              <Select defaultValue={task?.assigneeId ?? ""}>
                <option value="">Unassigned</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Status" name="status" required optionalLabel={false} error={errors.status}>
              <Select defaultValue={task?.status ?? defaultStatus ?? "TODO"}>
                {taskStatusValues.map((s) => (
                  <option key={s} value={s}>
                    {humanize(s)}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Priority" name="priority" required optionalLabel={false} error={errors.priority}>
              <Select defaultValue={task?.priority ?? "MEDIUM"}>
                {taskPriorityValues.map((p) => (
                  <option key={p} value={p}>
                    {humanize(p)}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Due date" name="dueDate" error={errors.dueDate}>
              <Input type="date" defaultValue={toDateInputValue(task?.dueDate)} />
            </FormField>
          </div>

          <FormField label="Description" name="description" error={errors.description}>
            <Textarea defaultValue={task?.description ?? ""} rows={3} className="min-h-20" placeholder="Acceptance criteria, links, context." />
          </FormField>

          <div className="flex justify-end gap-2 border-t border-bone/10 pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" loading={pending} disabled={projects.length === 0}>
              {task ? "Save task" : "Create task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
