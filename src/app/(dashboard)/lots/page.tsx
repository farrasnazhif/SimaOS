"use client";

import Link from "next/link";
import IncomingLotsTable from "@/features/lots/components/incoming-lots-table";
import { useLotsQuery } from "@/features/lots/queries/lots-queries";

export default function LotsPage() {
  const { data: lots } = useLotsQuery();

  const pendingQc = lots?.filter((l) => l.status === "in_qc").length ?? 0;
  const approved = lots?.filter((l) => l.status === "approved").length ?? 0;
  const rejected = lots?.filter((l) => l.status === "rejected").length ?? 0;
  const totalLots = lots?.length ?? 0;

  const kpis = [
    { label: "Pending QC", value: pendingQc, color: "text-amber-700", border: "border-amber-200", bg: "bg-amber-50" },
    { label: "Approved", value: approved, color: "text-green-700", border: "border-green-200", bg: "bg-green-50" },
    { label: "Rejected", value: rejected, color: "text-red-700", border: "border-red-200", bg: "bg-red-50" },
    { label: "Total Lots", value: totalLots, color: "text-emerald-700", border: "border-emerald-200", bg: "bg-emerald-50" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <nav className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            <span>Inventory</span>
            <span className="text-zinc-300">›</span>
            <span className="text-emerald-600">Raw Materials</span>
          </nav>
          <h1 className="text-2xl font-semibold text-zinc-900">Incoming Lots</h1>
          <p className="max-w-lg text-sm text-zinc-500">
            Manage incoming material lots, quality certifications, and batch initialization for production lines.
          </p>
        </div>
        <Link
          href="/batches/new"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all"
        >
          + CREATE BATCH
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`rounded-xl border ${kpi.border} ${kpi.bg} p-4`}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{kpi.label}</p>
            <p className={`mt-1 text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <IncomingLotsTable />
    </div>
  );
}
