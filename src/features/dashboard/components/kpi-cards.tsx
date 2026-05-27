"use client";

import { useDashboardKpiQuery } from "../queries/dashboard-queries";

const cards = [
  { key: "totalLots" as const, label: "Total Lots", color: "text-blue-400" },
  { key: "pendingQc" as const, label: "Pending QC", color: "text-amber-400" },
  { key: "approvedToday" as const, label: "Approved Today", color: "text-emerald-400" },
  { key: "rejectedToday" as const, label: "Rejected Today", color: "text-red-400" },
];

export default function KpiCards() {
  const { data, isLoading } = useDashboardKpiQuery();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.key} className="rounded-lg border border-zinc-700/50 bg-zinc-900 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{card.label}</p>
          <p className={`mt-1 text-3xl font-bold ${card.color}`}>
            {isLoading ? "—" : data?.[card.key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}
