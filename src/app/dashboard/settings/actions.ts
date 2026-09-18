"use server";

import { revalidatePath } from "next/cache";
import { requireApiAdmin } from "@/lib/auth/session";
import { runAction, type ActionResult } from "@/lib/actions";
import { ValidationError } from "@/lib/errors";
import { flattenZodError } from "@/lib/http";
import { updateSettings } from "@/lib/services/settings";
import { createTeamMember } from "@/lib/services/users";
import { settingsSchema } from "@/lib/validation/settings";
import { teamMemberSchema } from "@/lib/validation/auth";

export async function saveSettingsAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return runAction(async () => {
    await requireApiAdmin();
    const raw = Object.fromEntries(formData.entries());
    if (!("lead_auto_reply_enabled" in raw)) raw.lead_auto_reply_enabled = "false";
    const parsed = settingsSchema.safeParse(raw);
    if (!parsed.success) throw new ValidationError(flattenZodError(parsed.error));
    await updateSettings(parsed.data);
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/automations");
    return undefined;
  }, "Settings saved.");
}

export async function addTeamMemberAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return runAction(async () => {
    await requireApiAdmin();
    const parsed = teamMemberSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) throw new ValidationError(flattenZodError(parsed.error));
    await createTeamMember(parsed.data);
    revalidatePath("/dashboard/settings");
    return undefined;
  }, "Team member added.");
}
