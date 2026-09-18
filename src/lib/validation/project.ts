import { z } from "zod";
import { ProjectStatus } from "@/generated/prisma/enums";
import { checkbox, emptyToUndefined, optionalDate, optionalEnum, optionalString, paginationSchema } from "./common";

export const projectStatusValues = Object.values(ProjectStatus) as [ProjectStatus, ...ProjectStatus[]];

export const projectInputSchema = z.object({
  name: z.string().trim().min(2, "Project name is required.").max(120),
  slug: optionalString(140),
  description: optionalString(2000),
  category: optionalString(80),
  status: z.preprocess(emptyToUndefined, z.enum(projectStatusValues).default("DRAFT")),
  featured: checkbox.default(false),
  image: optionalString(300),
  notes: optionalString(5000),
  deadline: optionalDate,
  clientId: optionalString(64),
  ownerId: optionalString(64),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

export const projectUpdateSchema = projectInputSchema.partial();
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;

export const projectFilterSchema = paginationSchema.extend({
  status: optionalEnum(projectStatusValues),
  q: optionalString(120),
  clientId: optionalString(64),
});

export type ProjectFilters = z.infer<typeof projectFilterSchema>;
