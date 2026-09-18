"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField, Textarea } from "@/components/ui/form-field";
import { addLeadNoteAction } from "@/app/dashboard/leads/actions";
import type { ActionResult } from "@/lib/actions";

export function LeadNoteForm({ leadId }: { leadId: string }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(addLeadNoteAction, null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const lastState = React.useRef<ActionResult | null>(null);

  React.useEffect(() => {
    if (state && state !== lastState.current) {
      lastState.current = state;
      if (state.ok) {
        toast.success(state.message ?? "Note added.");
        formRef.current?.reset();
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="leadId" value={leadId} />
      <FormField label="Note" name="note" required optionalLabel={false} error={state && !state.ok ? state.fieldErrors?.note : undefined}>
        <Textarea rows={4} placeholder="Call summary, next step, context…" className="min-h-24" />
      </FormField>
      <Button type="submit" size="sm" loading={pending}>
        Add note
      </Button>
    </form>
  );
}
