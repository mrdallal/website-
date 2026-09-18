"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireApiAdmin, requireApiUser } from "@/lib/auth/session";
import { runAction, type ActionResult } from "@/lib/actions";
import { ValidationError } from "@/lib/errors";
import { flattenZodError } from "@/lib/http";
import { createProject, deleteProject, updateProject } from "@/lib/services/projects";
import { projectInputSchema, projectStatusValues, projectUpdateSchema } from "@/lib/validation/project";

function revalidateProjects(id?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/tasks");
  if (id) revalidatePath(`/dashboard/projects/${id}`);
}

export async function createProjectAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  let createdId: string | null = null;
  const result = await runAction(async () => {
    const user = await requireApiUser();
    const parsed = projectInputSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) throw new ValidationError(flattenZodError(parsed.error));
    const project = await createProject(parsed.data, user.id);
    createdId = project.id;
    revalidateProjects(project.id);
    return undefined;
  });
  if (result.ok && createdId) redirect(`/dashboard/projects/${createdId}?created=1`);
  return result;
}

export async function updateProjectAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("projectId") ?? "");
  const result = await runAction(async () => {
    const user = await requireApiUser();
    const raw = Object.fromEntries(formData.entries());
    // Checkbox absence must mean false on edit, not "unchanged".
    if (!("featured" in raw)) raw.featured = "false";
    const parsed = projectUpdateSchema.safeParse(raw);
    if (!parsed.success) throw new ValidationError(flattenZodError(parsed.error));
    await updateProject(id, parsed.data, user.id);
    revalidateProjects(id);
    return undefined;
  });
  if (result.ok) redirect(`/dashboard/projects/${id}?updated=1`);
  return result;
}

export async function setProjectStatusAction(id: string, status: string): Promise<ActionResult> {
  return runAction(async () => {
    const user = await requireApiUser();
    if (!(projectStatusValues as readonly string[]).includes(status)) {
      throw new ValidationError({ status: ["Invalid status."] });
    }
    await updateProject(id, { status: status as (typeof projectStatusValues)[number] }, user.id);
    revalidateProjects(id);
    return undefined;
  }, "Project status updated.");
}

export async function saveProjectNotesAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("projectId") ?? "");
  return runAction(async () => {
    const user = await requireApiUser();
    const parsed = projectUpdateSchema.pick({ notes: true }).safeParse({ notes: formData.get("notes") });
    if (!parsed.success) throw new ValidationError(flattenZodError(parsed.error));
    await updateProject(id, { notes: parsed.data.notes ?? "" }, user.id);
    revalidateProjects(id);
    return undefined;
  }, "Notes saved.");
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireApiAdmin();
    await deleteProject(id);
    revalidateProjects();
    return undefined;
  });
  if (result.ok) redirect("/dashboard/projects?deleted=1");
  return result;
}
