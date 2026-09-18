"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField, FormMessage, Input, Select } from "@/components/ui/form-field";
import { addTeamMemberAction } from "@/app/dashboard/settings/actions";
import type { ActionResult } from "@/lib/actions";

export function TeamMemberForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(addTeamMemberAction, null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const lastState = React.useRef<ActionResult | null>(null);
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  React.useEffect(() => {
    if (state && state !== lastState.current) {
      lastState.current = state;
      if (state.ok) {
        toast.success(state.message ?? "Added.");
        formRef.current?.reset();
      } else if (!state.fieldErrors) {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {state && !state.ok && !state.fieldErrors ? <FormMessage tone="error">{state.message}</FormMessage> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Name" name="name" required error={errors.name}>
          <Input placeholder="Full name" autoComplete="off" />
        </FormField>
        <FormField label="Email" name="email" required error={errors.email}>
          <Input type="email" placeholder="name@yourdomain.com" autoComplete="off" />
        </FormField>
        <FormField label="Temporary password" name="password" required error={errors.password} hint="At least 10 characters. Share it securely.">
          <Input type="password" autoComplete="new-password" />
        </FormField>
        <FormField label="Role" name="role" required optionalLabel={false} error={errors.role}>
          <Select defaultValue="TEAM_MEMBER">
            <option value="TEAM_MEMBER">Team member</option>
            <option value="ADMIN">Admin</option>
          </Select>
        </FormField>
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="sm" loading={pending}>
          Add team member
        </Button>
      </div>
    </form>
  );
}
