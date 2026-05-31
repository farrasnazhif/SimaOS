"use client";

import { useQuery } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import Breadcrumb from "@/components/ui/breadcrumb";
import StatusLotsTable from "../components/status/status-lots-table";
import StatusQualityChart from "../components/status/status-quality-chart";
import StatusInfoPanel from "../components/status/status-info-panel";
import { LotRow, StatusConfig } from "../components/status/types";

const STATUS_CONFIG: Record<string, StatusConfig> = {
  in_qc: { label: "Awaiting QC", heading: "Pending QC", description: "Lots pending quality check.", badgeBg: "bg-amber-100/70", badgeText: "text-amber-600" },
  approved: { label: "Approved", heading: "Approved Lots", description: "Lots that passed quality control.", badgeBg: "bg-emerald-100/70", badgeText: "text-emerald-600" },
  rejected: { label: "Rejected", heading: "Rejected Lots", description: "Lots that failed quality control.", badgeBg: "bg-red-100/70", badgeText: "text-red-600" },
};

function useLotsbyStatusQuery(status: string) {
  return useQuery({
    queryKey: ["lots", "status", status],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("lots")
        .select("id, lot_number, material_name, quantity_kg, arrival_date, status, supplier:suppliers(name), qc_inspections(ai_quality_score)")
        .eq("status", status)
        .order("arrival_date", { ascending: false });
      if (error) throw error;
      return data as LotRow[];
    },
  });
}

export default function LotStatusDetailPage({ status }: { status: string }) {
  const { data: lots, isLoading } = useLotsbyStatusQuery(status);
  const config = STATUS_CONFIG[status] ?? { label: status, heading: status, description: "", badgeBg: "bg-zinc-100", badgeText: "text-zinc-600" };

  return (
    <div>
      <Breadcrumb lastLabel={config.heading} />

      <div className="mb-6">
        <h1 className="text-[32px] font-semibold tracking-tight leading-none text-zinc-900">{config.heading}</h1>
        <p className="mt-2 text-sm text-zinc-500">{config.description}</p>
      </div>

      <div className="space-y-6">
        <StatusLotsTable lots={lots} isLoading={isLoading} config={config} />

        <div className="grid grid-cols-12 gap-6">
          <StatusQualityChart lots={lots ?? []} />
          <StatusInfoPanel lots={lots ?? []} />
        </div>
      </div>
    </div>
  );
}
