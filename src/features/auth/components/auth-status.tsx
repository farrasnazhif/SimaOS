"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/use-auth";
import { useLogoutMutation } from "@/features/auth/auth-queries";

export function AuthStatus() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const logout = useLogoutMutation();

  if (isLoading) {
    return <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Not authenticated
        </div>
        <div className="flex gap-2">
          <Link className="text-sm font-medium underline" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium underline" href="/register">
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Signed in as{" "}
        <span className="font-medium text-zinc-950 dark:text-zinc-50">
          {user?.email}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link className="text-sm font-medium underline" href="/profile">
          View profile
        </Link>
        <button
          className="text-sm font-medium underline disabled:opacity-60"
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

