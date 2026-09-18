import { z } from "zod";
import { ClientStatus } from "@/generated/prisma/enums";
import { emptyToUndefined, optionalEnum, optionalString, paginationSchema } from "./common";

export const clientStatusValues = Object.values(ClientStatus) as [ClientStatus, ...ClientStatus[]];

export const clientInputSchema = z.object({
  name: z.string().trim().min(2, "Client name is required.").max(120),
  company: optionalString(120),
  email: z.preprocess(emptyToUndefined, z.email("Enter a valid email.").max(200).optional()),
  website: optionalString(200),
  status: z.preprocess(emptyToUndefined, z.enum(clientStatusValues).default("ACTIVE")),
  notes: optionalString(5000),
  leadId: optionalString(64),
});

export type ClientInput = z.infer<typeof clientInputSchema>;

export const clientUpdateSchema = clientInputSchema.partial();
export type ClientUpdate = z.infer<typeof clientUpdateSchema>;

export const clientFilterSchema = paginationSchema.extend({
  status: optionalEnum(clientStatusValues),
  q: optionalString(120),
});

export type ClientFilters = z.infer<typeof clientFilterSchema>;
