"use server";

import { revalidatePath } from "next/cache";
import { requireApiUser } from "@/lib/auth/session";
import { runAction, type ActionResult } from "@/lib/actions";
import { ValidationError } from "@/lib/errors";
import { flattenZodError } from "@/lib/http";
import { createTask, deleteTask, getTaskById, moveTask, updateTask } from "@/lib/services/tasks";
import { taskInputSchema, taskStatusValues, taskUpdateSchema } from "@/lib/validation/task";

function revalidateTasks(projectId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/projects");
  if (projectId) revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function createTaskAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return runAction(async () => {
    const user = await requireApiUser();
    const parsed = taskInputSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) throw new ValidationError(flattenZodError(parsed.error));
    const task = await createTask(parsed.data, user.id);
    revalidateTasks(task.projectId);
    return undefined;
  }, "Task created.");
}

export async function updateTaskAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("taskId") ?? "");
  return runAction(async () => {
    const user = await requireApiUser();
    const parsed = taskUpdateSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) throw new ValidationError(flattenZodError(parsed.error));
    const before = await getTaskById(id);
    const task = await updateTask(id, parsed.data, user.id);
    revalidateTasks(task.projectId);
    if (before.projectId !== task.projectId) revalidateTasks(before.projectId);
    return undefined;
  }, "Task updated.");
}

export async function moveTaskAction(id: string, status: string): Promise<ActionResult> {
  return runAction(async () => {
    const user = await requireApiUser();
    if (!(taskStatusValues as readonly string[]).includes(status)) throw new ValidationError({ status: ["Invalid status."] });
    const task = await moveTask(id, status as (typeof taskStatusValues)[number], user.id);
    revalidateTasks(task.projectId);
    return undefined;
  });
}

export async function deleteTaskAction(id: string): Promise<ActionResult> {
  return runAction(async () => {
    await requireApiUser();
    const task = await getTaskById(id);
    await deleteTask(id);
    revalidateTasks(task.projectId);
    return undefined;
  }, "Task deleted.");
}
