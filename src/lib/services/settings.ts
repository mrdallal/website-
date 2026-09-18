import "server-only";
import { prisma } from "@/lib/db/prisma";
import { settingKeys, type SettingKey, type SettingsInput } from "@/lib/validation/settings";

export type SettingsMap = Record<SettingKey, string>;

const defaults: SettingsMap = {
  agency_name: "TECHSIDES",
  notify_email: "",
  booking_url: "",
  ghl_pipeline_id: "",
  ghl_pipeline_stage_id: "",
  lead_auto_reply_enabled: "false",
};

export async function getSettings(): Promise<SettingsMap> {
  const rows = await prisma.setting.findMany({ where: { key: { in: [...settingKeys] } } });
  const map: SettingsMap = { ...defaults };
  for (const row of rows) {
    if ((settingKeys as readonly string[]).includes(row.key)) {
      map[row.key as SettingKey] = row.value;
    }
  }
  return map;
}

export async function getSetting(key: SettingKey): Promise<string> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? defaults[key];
}

export async function updateSettings(input: SettingsInput): Promise<SettingsMap> {
  const entries = Object.entries(input) as [SettingKey, string | boolean | undefined][];
  await prisma.$transaction(
    entries.map(([key, value]) => {
      const stored = value === undefined ? "" : typeof value === "boolean" ? String(value) : value;
      return prisma.setting.upsert({
        where: { key },
        create: { key, value: stored },
        update: { value: stored },
      });
    }),
  );
  return getSettings();
}
