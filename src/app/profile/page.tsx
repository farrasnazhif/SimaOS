"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/use-auth";
import { useLogoutMutation } from "@/features/auth/auth-queries";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, profile, isLoading } = useAuth();
  const logout = useLogoutMutation();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
        <main className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-950">
          <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Profile
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            You are not logged in.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
              href="/register"
            >
              Register
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-950">
        <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
          User profile
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Data from `supabase.auth.getUser()`.
        </p>

        <div className="mt-6 space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="text-sm">
            <div className="text-zinc-600 dark:text-zinc-400">Email</div>
            <div className="font-medium text-zinc-950 dark:text-zinc-50">
              {profile?.email}
            </div>
          </div>
          <div className="text-sm">
            <div className="text-zinc-600 dark:text-zinc-400">User ID</div>
            <div className="font-mono text-xs text-zinc-950 dark:text-zinc-50">
              {profile?.id}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            type="button"
            onClick={async () => {
              await logout.mutateAsync();
              router.push("/login");
            }}
            disabled={logout.isPending}
          >
            {logout.isPending ? "Logging out…" : "Logout"}
          </button>
          <Link
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            href="/"
          >
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}

