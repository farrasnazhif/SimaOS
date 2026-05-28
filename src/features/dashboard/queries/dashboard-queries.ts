"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export type DashboardKpi = {
  pendingQc: number;
  approved: number;
  rejected: number;
  totalValue: number;
};

export function useDashboardKpiQuery() {
  return useQuery({
    queryKey: ["dashboard", "kpi"],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const lotsTable = supabase.from("lots") as any;

      const [pending, approved, rejected, totalValue] = await Promise.all([
        lotsTable.select("id", { count: "exact", head: true }).eq("status", "in_qc"),
        lotsTable.select("id", { count: "exact", head: true }).eq("status", "approved"),
        lotsTable.select("id", { count: "exact", head: true }).eq("status", "rejected"),
        lotsTable.select("quantity_kg"),
      ]);

      const total = (totalValue.data as { quantity_kg: number }[] | null)?.reduce(
        (sum: number, row: { quantity_kg: number }) => sum + Number(row.quantity_kg), 0
      ) ?? 0;

      return {
        pendingQc: pending.count ?? 0,
        approved: approved.count ?? 0,
        rejected: rejected.count ?? 0,
        totalValue: total,
      } as DashboardKpi;
    },
  });
}
