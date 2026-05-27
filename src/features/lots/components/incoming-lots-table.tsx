"use client";

import Link from "next/link";
import { useLotsQuery } from "../queries/lots-queries";

const statusConfig: Record<string, { label: string; color: string }> = {
  approved: { label: "Approved", color: "bg-green-50 text-green-700 border-green-200" },
  in_qc: { label: "In QC", color: "bg-amber-50 text-amber-700 border-amber-200" },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-700 border-red-200" },
  in_production: { label: "In Production", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  arriving: { label: "Arriving", color: "bg-zinc-50 text-zinc-600 border-zinc-200" },
};

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

  if (isLoading) {
    return <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-400">Loading lots...</div>;
  }
  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">Failed to load lots.</div>;
  }
  if (!lots || lots.length === 0) {
    return <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-400">No lots found.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-zinc-900">Lots List</h4>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
            {lots.length} entries
          </span>
        </div>
        <Link href="/batches/new" className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
          + Create Batch
        </Link>
      </div>

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
            {lots.map((lot) => (
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
    </div>
  );
}
