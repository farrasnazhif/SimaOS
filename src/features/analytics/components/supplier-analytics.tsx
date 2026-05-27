"use client";

import { useSupplierAnalyticsQuery } from "../queries/analytics-queries";

export default function SupplierAnalytics() {
  const { data: metrics, isLoading } = useSupplierAnalyticsQuery();

  if (isLoading) return <p className="text-sm text-zinc-400">Loading analytics...</p>;
  if (!metrics || metrics.length === 0) return <p className="text-sm text-zinc-500">No supplier data yet.</p>;

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-700/50 bg-zinc-900">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-zinc-700/50 bg-zinc-800/30">
            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Supplier</th>
            <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-400">Avg Score</th>
            <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-400">Approval %</th>
            <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-400">Rejection %</th>
            <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Lots</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-700/30">
          {metrics.map((m) => (
            <tr key={m.supplier_name} className="hover:bg-zinc-800/40">
              <td className="px-4 py-3 text-sm font-medium text-zinc-200">{m.supplier_name}</td>
              <td className="px-4 py-3 text-right font-mono text-sm text-blue-400">{m.avg_quality_score}</td>
              <td className="px-4 py-3 text-right font-mono text-sm text-emerald-400">{m.approval_rate}%</td>
              <td className="px-4 py-3 text-right font-mono text-sm text-red-400">{m.rejection_rate}%</td>
              <td className="px-4 py-3 text-right font-mono text-sm text-zinc-300">{m.total_lots}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
