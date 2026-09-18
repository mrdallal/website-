import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address.").max(200),
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  password: z.string().min(10, "Use at least 10 characters.").max(200),
  role: z.enum(["ADMIN", "TEAM_MEMBER"]).default("TEAM_MEMBER"),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
