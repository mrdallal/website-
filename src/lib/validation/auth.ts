import { z } from "zod";

/**
 * Sign-in accepts a username or an email in the same field, so short
 * identifiers such as "admin" work. Password strength is enforced when
 * accounts are created (teamMemberSchema), not at sign-in.
 */
export const loginSchema = z.object({
  email: z.string().trim().min(1, "Enter your username or email.").max(200),
  password: z.string().min(1, "Enter your password.").max(200),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  password: z.string().min(10, "Use at least 10 characters.").max(200),
  role: z.enum(["ADMIN", "TEAM_MEMBER"]).default("TEAM_MEMBER"),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
