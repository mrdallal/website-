"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Select } from "@/components/ui/form-field";
import { deleteProjectAction, setProjectStatusAction } from "@/app/dashboard/projects/actions";
import { projectStatusValues } from "@/lib/validation/project";
import { humanize } from "@/lib/utils";

interface ProjectHeaderActionsProps {
  projectId: string;
  status: string;
  isAdmin: boolean;
}

export function ProjectHeaderActions({ projectId, status, isAdmin }: ProjectHeaderActionsProps) {
  const [pending, startTransition] = React.useTransition();
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const setStatus = (next: string) => {
    startTransition(async () => {
      const result = await setProjectStatusAction(projectId, next);
      if (result.ok) toast.success(`Status set to ${humanize(next)}.`);
      else toast.error(result.message);
    });
  };

  const remove = () => {
    startTransition(async () => {
      const result = await deleteProjectAction(projectId);
      if (!result.ok) {
        toast.error(result.message);
        setConfirmDelete(false);
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="project-status-select" className="sr-only">
        Project status
      </label>
      <Select id="project-status-select" value={status} disabled={pending} onChange={(e) => setStatus(e.target.value)} className="h-9 w-auto min-w-36 text-sm">
        {projectStatusValues.map((s) => (
          <option key={s} value={s}>
            {humanize(s)}
          </option>
        ))}
      </Select>
      <Button asChild size="sm" variant="outline">
        <Link href={`/dashboard/projects/${projectId}/edit`}>Edit</Link>
      </Button>
      {isAdmin ? (
        <Button size="sm" variant="ghost" className="text-danger hover:bg-danger/10" disabled={pending} onClick={() => setConfirmDelete(true)}>
          Delete
        </Button>
      ) : null}
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this project?"
        description="All tasks and activity attached to the project will be removed. This cannot be undone."
        confirmLabel="Delete project"
        destructive
        loading={pending}
        onConfirm={remove}
      />
    </div>
  );
}
