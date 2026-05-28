"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLotsQuery } from "../queries/lots-queries";
import { Download, Filter } from "lucide-react";
import Button from "@/components/ui/buttons/button";

const statusConfig: Record<string, { label: string; color: string }> = {
  approved: { label: "Approved", color: "bg-green-50 text-green-700 border-green-200" },
  in_qc: { label: "In QC", color: "bg-amber-50 text-amber-700 border-amber-200" },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-700 border-red-200" },
  in_production: { label: "In Production", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  arriving: { label: "Arriving", color: "bg-zinc-50 text-zinc-600 border-zinc-200" },
};

const PAGE_SIZE = 5;

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, color: "bg-zinc-50 text-zinc-600 border-zinc-200" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
}

export default function IncomingLotsTable() {
  const { data: lots, isLoading, error } = useLotsQuery();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!lots) return [];
    if (statusFilter === "all") return lots;
    return lots.filter((l) => l.status === statusFilter);
  }, [lots, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function exportCsv() {
    if (!filtered.length) return;
    const header = "Lot ID,Material,Supplier,Arrival Date,Status\n";
    const rows = filtered
      .map((l) => `${l.lot_number},${l.material_name},${l.supplier?.name ?? ""},${l.arrival_date},${l.status}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lots-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-zinc-400">Loading lots...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-sm text-red-600">Failed to load lots.</div>;
  }
  if (!lots || lots.length === 0) {
    return <div className="p-8 text-center text-sm text-zinc-400">No lots found.</div>;
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2 px-2 pb-4">
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5">
          <Filter className="size-3.5 text-zinc-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border-none bg-transparent p-0 text-sm text-zinc-700 focus:outline-none focus:ring-0"
          >
            <option value="all">All Status</option>
            <option value="in_qc">In QC</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="in_production">In Production</option>
            <option value="arriving">Arriving</option>
          </select>
        </div>
        <Button variant="secondary" size="sm" leftIcon={Download} onClick={exportCsv}>
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Lot ID</th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Material</th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Supplier</th>
              <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-500">Arrival</th>
              <th className="px-6 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {paginated.map((lot) => (
              <tr key={lot.id} className="transition-colors hover:bg-emerald-50/30">
                <td className="px-6 py-3.5 text-sm font-semibold text-emerald-700">
                  <Link href={`/lots/${lot.id}`} className="hover:underline">{lot.lot_number}</Link>
                </td>
                <td className="px-6 py-3.5 text-sm text-zinc-700">{lot.material_name}</td>
                <td className="px-6 py-3.5 text-sm text-zinc-500">{lot.supplier?.name ?? "—"}</td>
                <td className="px-6 py-3.5 text-right font-mono text-sm text-zinc-500">{lot.arrival_date}</td>
                <td className="px-6 py-3.5 text-center"><StatusBadge status={lot.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination — centered */}
      <div className="flex items-center justify-center border-t border-zinc-100 px-6 py-4">
        <div className="flex items-center gap-1">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex h-8 w-8 items-center justify-center rounded border border-zinc-200 text-sm text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium ${
                p === page ? "bg-emerald-600 text-white" : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex h-8 w-8 items-center justify-center rounded border border-zinc-200 text-sm text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
