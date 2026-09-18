"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form-field";
import { saveProjectNotesAction } from "@/app/dashboard/projects/actions";
import type { ActionResult } from "@/lib/actions";

export function ProjectNotesEditor({ projectId, notes }: { projectId: string; notes: string }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(saveProjectNotesAction, null);
  const lastState = React.useRef<ActionResult | null>(null);

  React.useEffect(() => {
    if (state && state !== lastState.current) {
      lastState.current = state;
      if (state.ok) toast.success(state.message ?? "Saved.");
      else toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="projectId" value={projectId} />
      <label htmlFor="project-notes" className="sr-only">
        Project notes
      </label>
      <Textarea id="project-notes" name="notes" defaultValue={notes} rows={8} placeholder="Scope decisions, credentials location, risks, links…" />
      <div className="flex items-center justify-end">
        <Button type="submit" size="sm" variant="outline" loading={pending}>
          Save notes
        </Button>
      </div>
    </form>
  );
}
