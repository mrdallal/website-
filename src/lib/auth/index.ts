import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { loginSchema } from "@/lib/validation/auth";
import { ensureBootstrapAdmin, verifyPassword } from "@/lib/services/users";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { hashIdentifier } from "@/lib/security/request";
import { logger } from "@/lib/logger";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // Throttle brute-force attempts per email + IP.
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        const limit = await checkRateLimit({
          name: "login",
          identifier: hashIdentifier(`${parsed.data.email}:${ip}`),
          limit: 8,
          windowMs: 15 * 60 * 1000,
        });
        if (!limit.allowed) {
          logger.warn("Login rate limited");
          return null;
        }

        await ensureBootstrapAdmin();
        const user = await verifyPassword(parsed.data.email, parsed.data.password);
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
});
