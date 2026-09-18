"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireApiAdmin, requireApiUser } from "@/lib/auth/session";
import { runAction, type ActionResult } from "@/lib/actions";
import { ValidationError } from "@/lib/errors";
import { flattenZodError } from "@/lib/http";
import { createClient, deleteClient, updateClient } from "@/lib/services/clients";
import { clientInputSchema, clientUpdateSchema } from "@/lib/validation/client";

function revalidateClients(id?: string) {
  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard/projects");
  if (id) revalidatePath(`/dashboard/clients/${id}`);
}

export async function createClientAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  let createdId: string | null = null;
  const result = await runAction(async () => {
    await requireApiUser();
    const parsed = clientInputSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) throw new ValidationError(flattenZodError(parsed.error));
    const client = await createClient(parsed.data);
    createdId = client.id;
    revalidateClients(client.id);
    return undefined;
  });
  if (result.ok && createdId) redirect(`/dashboard/clients/${createdId}?created=1`);
  return result;
}

export async function updateClientAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("clientId") ?? "");
  const result = await runAction(async () => {
    await requireApiUser();
    const parsed = clientUpdateSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) throw new ValidationError(flattenZodError(parsed.error));
    await updateClient(id, parsed.data);
    revalidateClients(id);
    return undefined;
  });
  if (result.ok) redirect(`/dashboard/clients/${id}?updated=1`);
  return result;
}

export async function deleteClientAction(id: string): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireApiAdmin();
    await deleteClient(id);
    revalidateClients();
    return undefined;
  });
  if (result.ok) redirect("/dashboard/clients?deleted=1");
  return result;
}
