"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form-field";
import { saveLeadNotesAction } from "@/app/dashboard/leads/actions";
import type { ActionResult } from "@/lib/actions";

export function LeadNotesEditor({ leadId, notes }: { leadId: string; notes: string }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(saveLeadNotesAction, null);
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
      <input type="hidden" name="leadId" value={leadId} />
      <label htmlFor="lead-notes" className="sr-only">
        Internal notes
      </label>
      <Textarea id="lead-notes" name="notes" defaultValue={notes} rows={6} placeholder="Qualification notes, context from calls, links to proposals…" />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-mute">Saved with the lead record. Not visible to the lead.</p>
        <Button type="submit" size="sm" variant="outline" loading={pending}>
          Save notes
        </Button>
      </div>
    </form>
  );
}
