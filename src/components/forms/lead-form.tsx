"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { budgetOptions, serviceOptions, timelineOptions } from "@/content/lead-options";
import { leadInputSchema } from "@/lib/validation/lead";
import { Button } from "@/components/ui/button";
import { FormField, FormMessage, Input, Select, Textarea } from "@/components/ui/form-field";
import { submitLeadAction, type LeadFormState } from "@/app/(marketing)/contact/actions";

interface LeadFormProps {
  /** Preselect a service, e.g. from /contact?service=website */
  defaultService?: string;
}

const initialState: LeadFormState = { status: "idle" };

function flattenIssues(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = issue.path.map(String).join(".") || "_form";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

/**
 * Public lead form.
 *  1. Client-side validation (same Zod schema as the server) for instant feedback.
 *  2. Server Action validates again, rate limits, stores the lead, triggers automations.
 *  3. Success state replaces the form with the lead reference.
 *
 * React resets uncontrolled forms after an action completes, so on failure the
 * server echoes the submitted values back and they are used as defaults.
 */
export function LeadForm({ defaultService }: LeadFormProps) {
  const [state, formAction, pending] = useActionState(submitLeadAction, initialState);
  const [clientErrors, setClientErrors] = React.useState<Record<string, string[]>>({});
  const [startedAt] = React.useState(() => Date.now());
  const formRef = React.useRef<HTMLFormElement>(null);

  const errors = Object.keys(clientErrors).length ? clientErrors : state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? state.values : {};

  const validateOnClient = (event: React.FormEvent<HTMLFormElement>) => {
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const result = leadInputSchema.safeParse(data);
    if (!result.success) {
      event.preventDefault();
      const flat = flattenIssues(result.error.issues);
      setClientErrors(flat);
      const first = Object.keys(flat)[0];
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setClientErrors({});
  };

  if (state.status === "success") {
    return (
      <div role="status" aria-live="polite" className="border border-bone/15 bg-surface p-8 shadow-panel sm:p-10">
        <p className="label-mono text-ok">Lead submitted successfully</p>
        <h2 className="mt-6 text-h3 font-semibold">Thanks, {state.name.split(" ")[0]}. We have it.</h2>
        <p className="mt-4 max-w-[48ch] text-body text-bone/75">
          Your enquiry has been logged and the team has been notified. Someone will reply shortly with next steps.
        </p>
        <dl className="mt-8 grid gap-4 border-t border-bone/15 pt-6 sm:grid-cols-2">
          <div>
            <dt className="micro-mono text-mute">Reference</dt>
            <dd className="mt-2 font-mono text-sm">{state.leadId}</dd>
          </div>
          <div>
            <dt className="micro-mono text-mute">What happens next</dt>
            <dd className="mt-2 text-sm">Discovery call, then a written plan.</dd>
          </div>
        </dl>
        <Button asChild variant="outline" withArrow className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={validateOnClient} noValidate className="space-y-8">
      {state.status === "error" && !state.fieldErrors ? <FormMessage tone="error">{state.message}</FormMessage> : null}
      {Object.keys(errors).length > 0 && (Object.keys(clientErrors).length > 0 || state.status === "error") ? (
        <FormMessage tone="error">Please check the highlighted fields.</FormMessage>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Name" name="name" required error={errors.name}>
          <Input autoComplete="name" placeholder="Your name" defaultValue={values.name ?? ""} />
        </FormField>
        <FormField label="Email" name="email" required error={errors.email}>
          <Input type="email" autoComplete="email" placeholder="you@company.com" defaultValue={values.email ?? ""} />
        </FormField>
        <FormField label="Company" name="company" error={errors.company}>
          <Input autoComplete="organization" placeholder="Company name" defaultValue={values.company ?? ""} />
        </FormField>
        <FormField label="Website" name="website" error={errors.website}>
          <Input type="text" inputMode="url" autoComplete="url" placeholder="yourwebsite.com" defaultValue={values.website ?? ""} />
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <FormField label="What do you need?" name="service" error={errors.service}>
          <Select defaultValue={values.service ?? defaultService ?? ""}>
            <option value="">Select</option>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Budget range" name="budget" error={errors.budget}>
          <Select defaultValue={values.budget ?? ""}>
            <option value="">Select</option>
            {budgetOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Timeline" name="timeline" error={errors.timeline}>
          <Select defaultValue={values.timeline ?? ""}>
            <option value="">Select</option>
            {timelineOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField
        label="Message"
        name="message"
        error={errors.message}
        hint="Where is the attention coming from today, and where do you think it leaks?"
      >
        <Textarea rows={6} placeholder="Tell us about the situation." defaultValue={values.message ?? ""} />
      </FormField>

      {/* Anti-spam: honeypot + render timestamp. Hidden from humans and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="company_fax">Fax</label>
        <input id="company_fax" name="company_fax" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="form_started_at" value={startedAt} />

      <div className="flex flex-col gap-4 border-t border-bone/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-mute">We reply to every enquiry. No newsletters, no spam.</p>
        <Button type="submit" size="lg" withArrow loading={pending}>
          {pending ? "Submitting" : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}
