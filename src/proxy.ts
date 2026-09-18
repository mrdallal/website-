import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

/**
 * Optimistic auth check at the edge of the app: unauthenticated requests to
 * /dashboard are redirected to /login before any page code runs.
 * Real authorization happens again in layouts, server actions and API routes.
 */
const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  matcher: ["/dashboard/:path*"],
};
