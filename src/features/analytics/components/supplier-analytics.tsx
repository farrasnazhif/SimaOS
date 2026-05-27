"use client";

import { useSupplierAnalyticsQuery } from "../queries/analytics-queries";

export default function SupplierAnalytics() {
  const { data: metrics, isLoading } = useSupplierAnalyticsQuery();

  if (isLoading) return <p className="text-sm text-zinc-400">Loading analytics...</p>;
  if (!metrics || metrics.length === 0) return <p className="text-sm text-zinc-500">No supplier data yet.</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50/50">
            <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Supplier</th>
            <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-500">Avg Score</th>
            <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-500">Approval %</th>
            <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-500">Rejection %</th>
            <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-500">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {metrics.map((m) => (
            <tr key={m.supplier_name} className="hover:bg-emerald-50/30">
              <td className="px-4 py-3 text-sm font-medium text-zinc-800">{m.supplier_name}</td>
              <td className="px-4 py-3 text-right font-mono text-sm text-emerald-700">{m.avg_quality_score}</td>
              <td className="px-4 py-3 text-right font-mono text-sm text-green-600">{m.approval_rate}%</td>
              <td className="px-4 py-3 text-right font-mono text-sm text-red-600">{m.rejection_rate}%</td>
              <td className="px-4 py-3 text-right font-mono text-sm text-zinc-600">{m.total_lots}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
