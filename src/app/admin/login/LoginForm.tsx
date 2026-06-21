"use client";

import { useState, useTransition } from "react";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { login } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await login(formData);
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      {error && (
        <div className="rounded-xl border border-rust/30 bg-rust/5 px-4 py-3 text-sm text-rust">{error}</div>
      )}

      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" required placeholder="you@thenomichi.com" />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" required placeholder="••••••••" />
      </Field>

      <Button type="submit" size="lg" disabled={isPending} className="mt-1">
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
