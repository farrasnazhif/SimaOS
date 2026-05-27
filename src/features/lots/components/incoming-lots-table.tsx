"use client";

import { useLotsQuery, Lot } from "../queries/lots-queries";

const statusConfig: Record<string, { label: string; color: string }> = {
  approved: {
    label: "Approved",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  in_qc: {
    label: "In QC",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? {
    label: status,
    color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[11px] font-bold uppercase tracking-wider ${config.color}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${status === "in_qc" ? "bg-amber-400" : status === "rejected" ? "bg-red-400" : "bg-blue-400"}`}
      />
      {config.label}
    </span>
  );
}

export default function IncomingLotsTable() {
  const { data: lots, isLoading, error } = useLotsQuery();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-zinc-700/50 bg-zinc-900 p-8 text-center text-sm text-zinc-400">
        Loading lots...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-zinc-900 p-8 text-center text-sm text-red-400">
        Failed to load lots.
      </div>
    );
  }

  if (!lots || lots.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-700/50 bg-zinc-900 p-8 text-center text-sm text-zinc-400">
        No lots found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-700/50 bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-700/50 bg-zinc-800/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <h4 className="text-lg font-semibold text-zinc-100">Lots List</h4>
          <span className="rounded bg-zinc-700 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
            {lots.length} TOTAL ENTRIES
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-700/50 bg-zinc-800/30">
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Lot ID
              </th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Material
              </th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Supplier
              </th>
              <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Arrival Date
              </th>
              <th className="px-6 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-700/30">
            {lots.map((lot) => (
              <tr
                key={lot.id}
                className="transition-colors hover:bg-zinc-800/40"
              >
                <td className="px-6 py-4 font-mono text-sm font-bold text-blue-400">
                  {lot.lot_number}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-zinc-200">
                  {lot.material_name}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-400">
                  {lot.supplier?.name ?? "—"}
                </td>
                <td className="px-6 py-4 text-right font-mono text-sm text-zinc-300">
                  {lot.arrival_date}
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={lot.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
