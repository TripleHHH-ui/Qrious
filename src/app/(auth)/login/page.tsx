"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { login } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-terracotta py-2 font-semibold text-white disabled:opacity-60"
    >
      {pending ? "Logging in…" : "Log in"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, { error: null });

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
      <p className="mb-6 text-sm text-neutral-600">Log in to keep hunting hawker gems.</p>
      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded-lg border border-neutral-300 px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="rounded-lg border border-neutral-300 px-3 py-2"
        />
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <SubmitButton />
      </form>
      <p className="mt-4 text-sm text-neutral-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-terracotta">
          Sign up
        </Link>
      </p>
    </main>
  );
}
