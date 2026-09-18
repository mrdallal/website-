import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "./index";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";
import type { Role } from "@/generated/prisma/enums";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/** Cached per request so layouts and pages can both call it cheaply. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || !user.email) return null;
  return {
    id: user.id,
    name: user.name ?? user.email,
    email: user.email,
    role: (user.role ?? "TEAM_MEMBER") as Role,
  };
});

/** For pages/layouts: redirect to login when unauthenticated. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard?forbidden=1");
  return user;
}

/** For API routes and server actions: throw typed errors instead of redirecting. */
export async function requireApiUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

export async function requireApiAdmin(): Promise<SessionUser> {
  const user = await requireApiUser();
  if (user.role !== "ADMIN") throw new ForbiddenError();
  return user;
}
