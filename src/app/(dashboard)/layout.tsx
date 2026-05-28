"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useRouter } from "next/navigation";
import AppShell from "@/components/ui/app-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) router.push("/login");

  return <AppShell>{children}</AppShell>;
}
