"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { loginSchema } from "@/lib/validation/auth";

export interface LoginState {
  error: string | null;
  /** Echoed back so the field keeps its value after a failed attempt. */
  email?: string;
}

function safeRedirect(value: unknown): string {
  if (typeof value === "string" && value.startsWith("/dashboard") && !value.startsWith("//")) return value;
  return "/dashboard";
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = typeof formData.get("email") === "string" ? String(formData.get("email")) : "";
  const parsed = loginSchema.safeParse({
    email,
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email address and a password of at least 8 characters.", email };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: safeRedirect(formData.get("callbackUrl")),
    });
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password.", email };
    }
    // Auth.js signals a successful redirect by throwing; let Next.js handle it.
    throw error;
  }
}
