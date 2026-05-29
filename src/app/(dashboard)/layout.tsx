"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/ui/app-shell";
import { useAuth } from "@/features/auth/hooks/use-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
