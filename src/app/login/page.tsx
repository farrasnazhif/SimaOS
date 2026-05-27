"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/features/auth/auth-queries";

export default function LoginPage() {
  const router = useRouter();
  const login = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-950">
        <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
          Login
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Email and password.
        </p>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await login.mutateAsync({ email, password });
            router.push("/profile");
          }}
        >
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Email
            </span>
            <input
              className="h-11 rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-200"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Password
            </span>
            <input
              className="h-11 rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-200"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {login.error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-950 dark:bg-red-950/30 dark:text-red-200">
              {(login.error as Error).message}
            </div>
          ) : null}

          <button
            className="h-11 rounded-xl bg-zinc-950 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            type="submit"
            disabled={login.isPending}
          >
            {login.isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
          No account?{" "}
          <Link className="font-medium underline" href="/register">
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}

