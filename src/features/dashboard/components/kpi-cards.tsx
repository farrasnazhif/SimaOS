"use client";

import { useDashboardKpiQuery } from "../queries/dashboard-queries";

const cards = [
  { key: "totalLots" as const, label: "Total Lots", color: "text-emerald-700", border: "border-emerald-200", bg: "bg-emerald-50" },
  { key: "pendingQc" as const, label: "Pending QC", color: "text-amber-700", border: "border-amber-200", bg: "bg-amber-50" },
  { key: "approvedToday" as const, label: "Approved Today", color: "text-green-700", border: "border-green-200", bg: "bg-green-50" },
  { key: "rejectedToday" as const, label: "Rejected Today", color: "text-red-700", border: "border-red-200", bg: "bg-red-50" },
];

export default function KpiCards() {
  const { data, isLoading } = useDashboardKpiQuery();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.key} className={`rounded-xl border ${card.border} ${card.bg} p-4`}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{card.label}</p>
          <p className={`mt-1 text-3xl font-bold ${card.color}`}>
            {isLoading ? "—" : data?.[card.key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}
