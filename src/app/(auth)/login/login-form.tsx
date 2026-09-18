"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormField, FormMessage, Input } from "@/components/ui/form-field";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? <FormMessage tone="error">{state.error}</FormMessage> : null}
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <FormField label="Email" name="email" required>
        <Input type="email" autoComplete="email" placeholder="you@techsides.com" defaultValue={state.email ?? ""} autoFocus />
      </FormField>
      <FormField label="Password" name="password" required>
        <Input type="password" autoComplete="current-password" placeholder="••••••••••" />
      </FormField>
      <Button type="submit" size="lg" className="w-full" loading={pending} withArrow>
        {pending ? "Signing in" : "Sign in"}
      </Button>
    </form>
  );
}
