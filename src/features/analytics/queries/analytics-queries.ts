"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export type SupplierMetric = {
  supplier_name: string;
  total_lots: number;
  avg_quality_score: number;
  approval_rate: number;
  rejection_rate: number;
};

export function useSupplierAnalyticsQuery() {
  return useQuery({
    queryKey: ["analytics", "suppliers"],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();

      const { data, error } = await (supabase
        .from("lots") as any)
        .select("status, supplier:suppliers(name), qc_inspections(ai_quality_score)");
      if (error) throw error;

      type LotRow = { status: string; supplier: { name: string } | null; qc_inspections: { ai_quality_score: number }[] | null };

      // Aggregate by supplier
      const map = new Map<string, { total: number; approved: number; rejected: number; scores: number[] }>();

      for (const lot of (data as LotRow[]) ?? []) {
        const name = lot.supplier?.name ?? "Unknown";
        if (!map.has(name)) map.set(name, { total: 0, approved: 0, rejected: 0, scores: [] });
        const entry = map.get(name)!;
        entry.total++;
        if (lot.status === "approved") entry.approved++;
        if (lot.status === "rejected") entry.rejected++;
        const inspections = lot.qc_inspections;
        if (inspections) {
          for (const insp of inspections) {
            entry.scores.push(insp.ai_quality_score);
          }
        }
      }

      const metrics: SupplierMetric[] = [];
      for (const [name, entry] of map) {
        metrics.push({
          supplier_name: name,
          total_lots: entry.total,
          avg_quality_score: entry.scores.length > 0 ? Math.round(entry.scores.reduce((a, b) => a + b, 0) / entry.scores.length) : 0,
          approval_rate: entry.total > 0 ? Math.round((entry.approved / entry.total) * 100) : 0,
          rejection_rate: entry.total > 0 ? Math.round((entry.rejected / entry.total) * 100) : 0,
        });
      }

      return metrics.sort((a, b) => b.avg_quality_score - a.avg_quality_score);
    },
  });
}
