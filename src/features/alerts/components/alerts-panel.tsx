"use client";

import { useAlertsQuery, useResolveAlertMutation } from "../queries/alerts-queries";
import { toast } from "sonner";

const severityColors: Record<string, string> = {
  high: "border-l-red-500 bg-red-50",
  medium: "border-l-amber-500 bg-amber-50",
  low: "border-l-emerald-500 bg-emerald-50",
};

export default function AlertsPanel() {
  const { data: alerts, isLoading } = useAlertsQuery();
  const resolve = useResolveAlertMutation();

  if (isLoading) return <p className="text-sm text-zinc-400">Loading alerts...</p>;
  if (!alerts || alerts.length === 0) return <p className="text-sm text-zinc-500">No active alerts.</p>;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div key={alert.id} className={`rounded-lg border border-l-4 border-zinc-200 p-4 ${severityColors[alert.severity] ?? severityColors.low}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-800">{alert.title}</p>
              {alert.description && <p className="mt-1 text-xs text-zinc-500">{alert.description}</p>}
            </div>
            <button
              onClick={() => {
                toast.promise(resolve.mutateAsync(alert.id), {
                  loading: "Resolving...", success: "Resolved.", error: "Failed.",
                });
              }}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-800"
            >
              Resolve
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-500 border border-zinc-200">{alert.severity}</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-500 border border-zinc-200">{alert.alert_type}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
