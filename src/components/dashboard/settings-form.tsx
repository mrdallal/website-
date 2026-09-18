"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox, FormField, FormMessage, Input } from "@/components/ui/form-field";
import { saveSettingsAction } from "@/app/dashboard/settings/actions";
import type { ActionResult } from "@/lib/actions";
import type { SettingsMap } from "@/lib/services/settings";

export function SettingsForm({ settings, disabled }: { settings: SettingsMap; disabled: boolean }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(saveSettingsAction, null);
  const lastState = React.useRef<ActionResult | null>(null);
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  React.useEffect(() => {
    if (state && state !== lastState.current) {
      lastState.current = state;
      if (state.ok) toast.success(state.message ?? "Saved.");
      else if (!state.fieldErrors) toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      {state && !state.ok && !state.fieldErrors ? <FormMessage tone="error">{state.message}</FormMessage> : null}
      {disabled ? <FormMessage tone="info">Only admins can change settings.</FormMessage> : null}
      <fieldset disabled={disabled || pending} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField label="Agency name" name="agency_name" error={errors.agency_name}>
            <Input defaultValue={settings.agency_name} />
          </FormField>
          <FormField label="Lead notification email" name="notify_email" error={errors.notify_email} hint="Overrides NOTIFY_EMAIL from the environment.">
            <Input type="email" defaultValue={settings.notify_email} placeholder="team@yourdomain.com" />
          </FormField>
          <FormField label="Booking URL" name="booking_url" error={errors.booking_url} hint="Calendar link used by 'Book a call' when set (future use).">
            <Input defaultValue={settings.booking_url} placeholder="https://calendar.example.com/techsides" />
          </FormField>
        </div>
        <div className="grid gap-6 border-t border-bone/10 pt-6 md:grid-cols-2">
          <FormField label="GHL pipeline ID" name="ghl_pipeline_id" error={errors.ghl_pipeline_id} hint="Required to create opportunities.">
            <Input defaultValue={settings.ghl_pipeline_id} />
          </FormField>
          <FormField label="GHL pipeline stage ID" name="ghl_pipeline_stage_id" error={errors.ghl_pipeline_stage_id}>
            <Input defaultValue={settings.ghl_pipeline_stage_id} />
          </FormField>
        </div>
        <div className="border-t border-bone/10 pt-6">
          <Checkbox name="lead_auto_reply_enabled" label="Send an automatic confirmation email to new leads (requires Resend)" defaultChecked={settings.lead_auto_reply_enabled === "true"} />
        </div>
      </fieldset>
      {!disabled ? (
        <div className="flex justify-end border-t border-bone/10 pt-6">
          <Button type="submit" loading={pending}>
            Save settings
          </Button>
        </div>
      ) : null}
    </form>
  );
}
