"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useLogoutMutation } from "@/features/auth/queries/auth-queries";

export default function ProfileView() {
  const router = useRouter();
  const { isAuthenticated, profile, isLoading } = useAuth();
  const logout = useLogoutMutation();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 font-sans">
        <div className="text-sm text-zinc-600">Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 font-sans">
        <main className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-zinc-200">
          <h1 className="text-xl font-semibold text-zinc-950">Profile</h1>

          <p className="mt-2 text-sm text-zinc-600">You are not logged in.</p>

          <div className="mt-6 flex gap-3">
            <Link
              className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              href="/login"
            >
              Login
            </Link>

            <Link
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
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
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 font-sans">
      <main className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm border border-zinc-200">
        <h1 className="text-xl font-semibold text-zinc-950">User profile</h1>

        <p className="mt-2 text-sm text-zinc-600">
          Data from <code>supabase.auth.getUser()</code>.
        </p>

        <div className="mt-6 space-y-3 rounded-xl border border-zinc-200 p-4">
          <div className="text-sm">
            <div className="text-zinc-600">Email</div>
            <div className="font-medium text-zinc-950">{profile?.email}</div>
          </div>

          <div className="text-sm">
            <div className="text-zinc-600">User ID</div>
            <div className="font-mono text-xs text-zinc-950 break-all">
              {profile?.id}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
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
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
            href="/"
          >
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}
