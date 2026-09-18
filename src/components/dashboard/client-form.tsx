"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormField, FormMessage, Input, Select, Textarea } from "@/components/ui/form-field";
import { createClientAction, updateClientAction } from "@/app/dashboard/clients/actions";
import { clientStatusValues } from "@/lib/validation/client";
import type { ActionResult } from "@/lib/actions";
import { humanize } from "@/lib/utils";

export interface ClientFormValues {
  id?: string;
  name: string;
  company?: string | null;
  email?: string | null;
  website?: string | null;
  status: string;
  notes?: string | null;
}

interface ClientFormProps {
  mode: "create" | "edit";
  client?: ClientFormValues;
}

export function ClientForm({ mode, client }: ClientFormProps) {
  const action = mode === "create" ? createClientAction : updateClientAction;
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(action, null);
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  return (
    <form action={formAction} className="space-y-8">
      {state && !state.ok && !state.fieldErrors ? <FormMessage tone="error">{state.message}</FormMessage> : null}
      {client?.id ? <input type="hidden" name="clientId" value={client.id} /> : null}

      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Contact name" name="name" required error={errors.name}>
          <Input defaultValue={client?.name ?? ""} placeholder="Primary contact" />
        </FormField>
        <FormField label="Company" name="company" error={errors.company}>
          <Input defaultValue={client?.company ?? ""} placeholder="Company name" />
        </FormField>
        <FormField label="Email" name="email" error={errors.email}>
          <Input type="email" defaultValue={client?.email ?? ""} placeholder="contact@company.com" />
        </FormField>
        <FormField label="Website" name="website" error={errors.website}>
          <Input defaultValue={client?.website ?? ""} placeholder="company.com" />
        </FormField>
        <FormField label="Status" name="status" required optionalLabel={false} error={errors.status}>
          <Select defaultValue={client?.status ?? "ACTIVE"}>
            {clientStatusValues.map((s) => (
              <option key={s} value={s}>
                {humanize(s)}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Notes" name="notes" error={errors.notes} className="md:col-span-2">
          <Textarea defaultValue={client?.notes ?? ""} rows={4} placeholder="Context, preferences, billing details location." />
        </FormField>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-bone/15 pt-6 sm:flex-row sm:justify-end">
        <Button asChild variant="ghost">
          <Link href={client?.id ? `/dashboard/clients/${client.id}` : "/dashboard/clients"}>Cancel</Link>
        </Button>
        <Button type="submit" loading={pending}>
          {mode === "create" ? "Create client" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
