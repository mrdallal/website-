"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox, FormField, FormMessage, Input, Select, Textarea } from "@/components/ui/form-field";
import { createProjectAction, updateProjectAction } from "@/app/dashboard/projects/actions";
import { projectStatusValues } from "@/lib/validation/project";
import type { ActionResult } from "@/lib/actions";
import { humanize, toDateInputValue } from "@/lib/utils";

export interface ProjectFormValues {
  id?: string;
  name: string;
  slug?: string;
  description?: string | null;
  category?: string | null;
  status: string;
  featured: boolean;
  image?: string | null;
  notes?: string | null;
  deadline?: Date | null;
  clientId?: string | null;
  ownerId?: string | null;
}

interface ProjectFormProps {
  mode: "create" | "edit";
  project?: ProjectFormValues;
  clients: { id: string; name: string; company: string | null }[];
  team: { id: string; name: string }[];
}

export function ProjectForm({ mode, project, clients, team }: ProjectFormProps) {
  const action = mode === "create" ? createProjectAction : updateProjectAction;
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(action, null);
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  return (
    <form action={formAction} className="space-y-8">
      {state && !state.ok && !state.fieldErrors ? <FormMessage tone="error">{state.message}</FormMessage> : null}
      {project?.id ? <input type="hidden" name="projectId" value={project.id} /> : null}

      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Project name" name="name" required error={errors.name} className="md:col-span-2">
          <Input defaultValue={project?.name ?? ""} placeholder="e.g. Website and lead system" />
        </FormField>
        <FormField label="Client" name="clientId" error={errors.clientId}>
          <Select defaultValue={project?.clientId ?? ""}>
            <option value="">No client yet</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.company ? ` · ${c.company}` : ""}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Owner" name="ownerId" error={errors.ownerId} hint="Team member responsible for delivery.">
          <Select defaultValue={project?.ownerId ?? ""}>
            <option value="">Unassigned</option>
            {team.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Category" name="category" error={errors.category}>
          <Input defaultValue={project?.category ?? ""} placeholder="Website + Lead capture" />
        </FormField>
        <FormField label="Status" name="status" required optionalLabel={false} error={errors.status}>
          <Select defaultValue={project?.status ?? "DRAFT"}>
            {projectStatusValues.map((s) => (
              <option key={s} value={s}>
                {humanize(s)}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Deadline" name="deadline" error={errors.deadline}>
          <Input type="date" defaultValue={toDateInputValue(project?.deadline)} />
        </FormField>
        <FormField label="Slug" name="slug" error={errors.slug} hint="Leave empty to generate from the name.">
          <Input defaultValue={project?.slug ?? ""} placeholder="auto" />
        </FormField>
        <FormField label="Cover image path or URL" name="image" error={errors.image} className="md:col-span-2">
          <Input defaultValue={project?.image ?? ""} placeholder="/images/work/project.jpg" />
        </FormField>
        <FormField label="Description" name="description" error={errors.description} className="md:col-span-2">
          <Textarea defaultValue={project?.description ?? ""} rows={4} placeholder="What is being built and why." />
        </FormField>
        <FormField label="Internal notes" name="notes" error={errors.notes} className="md:col-span-2">
          <Textarea defaultValue={project?.notes ?? ""} rows={4} placeholder="Scope decisions, links, risks." />
        </FormField>
        <div className="md:col-span-2">
          <Checkbox name="featured" label="Feature this project on the public site (when published)" defaultChecked={project?.featured ?? false} />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-bone/15 pt-6 sm:flex-row sm:justify-end">
        <Button asChild variant="ghost">
          <Link href={project?.id ? `/dashboard/projects/${project.id}` : "/dashboard/projects"}>Cancel</Link>
        </Button>
        <Button type="submit" loading={pending}>
          {mode === "create" ? "Create project" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
