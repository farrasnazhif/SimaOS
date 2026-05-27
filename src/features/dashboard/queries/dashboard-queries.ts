"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export type DashboardKpi = {
  totalLots: number;
  pendingQc: number;
  approvedToday: number;
  rejectedToday: number;
};

export function useDashboardKpiQuery() {
  return useQuery({
    queryKey: ["dashboard", "kpi"],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const today = new Date().toISOString().slice(0, 10);

      const lotsTable = supabase.from("lots") as any;
      const [total, pending, approved, rejected] = await Promise.all([
        lotsTable.select("id", { count: "exact", head: true }),
        lotsTable.select("id", { count: "exact", head: true }).eq("status", "in_qc"),
        lotsTable.select("id", { count: "exact", head: true }).eq("status", "approved").gte("updated_at", today),
        lotsTable.select("id", { count: "exact", head: true }).eq("status", "rejected").gte("updated_at", today),
      ]);

      return {
        totalLots: total.count ?? 0,
        pendingQc: pending.count ?? 0,
        approvedToday: approved.count ?? 0,
        rejectedToday: rejected.count ?? 0,
      } as DashboardKpi;
    },
  });
}
