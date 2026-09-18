"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireApiUser } from "@/lib/auth/session";
import { runAction, type ActionResult } from "@/lib/actions";
import { ValidationError } from "@/lib/errors";
import { flattenZodError } from "@/lib/http";
import { addLeadNote, convertLeadToClient, deleteLead, updateLead, updateLeadStatus } from "@/lib/services/leads";
import { leadNoteSchema, leadStatusSchema, leadUpdateSchema } from "@/lib/validation/lead";

function revalidateLead(id: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${id}`);
}

export async function setLeadStatusAction(id: string, status: string): Promise<ActionResult> {
  return runAction(async () => {
    const user = await requireApiUser();
    const parsed = leadStatusSchema.safeParse({ status });
    if (!parsed.success) throw new ValidationError(flattenZodError(parsed.error));
    await updateLeadStatus(id, parsed.data.status, user.id);
    revalidateLead(id);
    return undefined;
  }, "Status updated.");
}

export async function addLeadNoteAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("leadId") ?? "");
  return runAction(async () => {
    const user = await requireApiUser();
    const parsed = leadNoteSchema.safeParse({ note: formData.get("note") });
    if (!parsed.success) throw new ValidationError(flattenZodError(parsed.error));
    await addLeadNote(id, parsed.data.note, user.id);
    revalidateLead(id);
    return undefined;
  }, "Note added.");
}

export async function saveLeadNotesAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("leadId") ?? "");
  return runAction(async () => {
    const user = await requireApiUser();
    const parsed = leadUpdateSchema.pick({ notes: true }).safeParse({ notes: formData.get("notes") });
    if (!parsed.success) throw new ValidationError(flattenZodError(parsed.error));
    await updateLead(id, { notes: parsed.data.notes ?? "" }, user.id);
    revalidateLead(id);
    return undefined;
  }, "Notes saved.");
}

export async function updateLeadDetailsAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("leadId") ?? "");
  return runAction(async () => {
    const user = await requireApiUser();
    const raw = Object.fromEntries(formData.entries());
    const parsed = leadUpdateSchema.safeParse(raw);
    if (!parsed.success) throw new ValidationError(flattenZodError(parsed.error));
    await updateLead(id, parsed.data, user.id);
    revalidateLead(id);
    return undefined;
  }, "Lead updated.");
}

export async function deleteLeadAction(id: string): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireApiUser();
    await deleteLead(id);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/leads");
    return undefined;
  });
  if (result.ok) redirect("/dashboard/leads?deleted=1");
  return result;
}

export async function convertLeadAction(id: string): Promise<ActionResult> {
  let clientId: string | null = null;
  const result = await runAction(async () => {
    const user = await requireApiUser();
    const client = await convertLeadToClient(id, user.id);
    clientId = client.id;
    revalidateLead(id);
    revalidatePath("/dashboard/clients");
    return undefined;
  });
  if (result.ok && clientId) redirect(`/dashboard/clients/${clientId}`);
  return result;
}
