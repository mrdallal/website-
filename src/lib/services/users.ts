import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/lib/errors";
import { normalizeEmail } from "@/lib/security/sanitize";
import type { TeamMemberInput } from "@/lib/validation/auth";

export const teamMemberSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

export async function listTeamMembers() {
  return prisma.user.findMany({ select: teamMemberSelect, orderBy: { createdAt: "asc" } });
}

export type TeamMember = Awaited<ReturnType<typeof listTeamMembers>>[number];

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
}

export async function countUsers() {
  return prisma.user.count();
}

export async function createTeamMember(input: TeamMemberInput) {
  const email = normalizeEmail(input.email);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError("A team member with that email already exists.", 409, "CONFLICT");
  const passwordHash = await bcrypt.hash(input.password, 12);
  return prisma.user.create({
    data: { name: input.name.trim(), email, passwordHash, role: input.role },
    select: teamMemberSelect,
  });
}

/**
 * First-run bootstrap: when the users table is empty and ADMIN_EMAIL /
 * ADMIN_PASSWORD are configured, create the admin so a fresh deployment can
 * be signed into without running the seed script by hand.
 */
export async function ensureBootstrapAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  if ((await prisma.user.count()) > 0) return;
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name: process.env.ADMIN_NAME?.trim() || "TECHSIDES Admin", email, passwordHash, role: "ADMIN" },
  });
}

export async function verifyPassword(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    // Constant-time-ish: still run a hash compare so timing does not reveal existence.
    await bcrypt.compare(password, "$2a$12$CwTycUXWue0Thq9StjUM0uJ8Z6t7O4r3h8YV4jV6d8YsN7ZKQ7YQe");
    return null;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
