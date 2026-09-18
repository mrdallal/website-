import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { Wordmark } from "@/components/marketing/wordmark";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

function safeCallback(value: unknown): string {
  if (typeof value !== "string") return "/dashboard";
  // Only allow same-origin relative paths inside the dashboard.
  if (value.startsWith("/dashboard") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    if (url.pathname.startsWith("/dashboard")) return url.pathname + url.search;
  } catch {
    // ignore
  }
  return "/dashboard";
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");
  const params = await searchParams;
  const callbackUrl = safeCallback(params.callbackUrl);

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 lg:hidden">
        <Wordmark size="lg" />
      </div>
      <p className="micro-mono text-mute">TECHSIDES OS</p>
      <h1 className="mt-4 text-h3 font-semibold">Sign in</h1>
      <p className="mt-3 text-sm text-mute">Use your team credentials to access the dashboard.</p>
      <div className="mt-8">
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
