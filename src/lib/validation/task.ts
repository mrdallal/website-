import { z } from "zod";
import { TaskPriority, TaskStatus } from "@/generated/prisma/enums";
import { emptyToUndefined, idSchema, optionalDate, optionalEnum, optionalString } from "./common";

export const taskStatusValues = Object.values(TaskStatus) as [TaskStatus, ...TaskStatus[]];
export const taskPriorityValues = Object.values(TaskPriority) as [TaskPriority, ...TaskPriority[]];

export const taskInputSchema = z.object({
  title: z.string().trim().min(2, "Task title is required.").max(200),
  description: optionalString(2000),
  status: z.preprocess(emptyToUndefined, z.enum(taskStatusValues).default("TODO")),
  priority: z.preprocess(emptyToUndefined, z.enum(taskPriorityValues).default("MEDIUM")),
  projectId: idSchema,
  assigneeId: optionalString(64),
  dueDate: optionalDate,
});

export type TaskInput = z.infer<typeof taskInputSchema>;

export const taskUpdateSchema = taskInputSchema.partial().extend({
  position: z.coerce.number().int().min(0).optional(),
});

export type TaskUpdate = z.infer<typeof taskUpdateSchema>;

export const taskFilterSchema = z.object({
  projectId: optionalString(64),
  status: optionalEnum(taskStatusValues),
  priority: optionalEnum(taskPriorityValues),
  assigneeId: optionalString(64),
  q: optionalString(120),
});

export type TaskFilters = z.infer<typeof taskFilterSchema>;
