"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">
          Username
        </span>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          className="input"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">
          Password
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="input"
        />
      </label>

      {state?.error ? (
        <p className="text-sm font-semibold text-accent-orange">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="pill-solid mt-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,113,227,0.35)] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
