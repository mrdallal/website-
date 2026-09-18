import type { TaskPriority, TaskStatus } from "@/generated/prisma/enums";

/** Serialisable task shape shared by server pages and client task components. */
export interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  dueDate: Date | null;
  projectId: string;
  assigneeId: string | null;
  project: { id: string; name: string };
  assignee: { id: string; name: string } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Option {
  id: string;
  name: string;
}
