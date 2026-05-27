"use client";

import { useAlertsQuery, useResolveAlertMutation } from "../queries/alerts-queries";
import { toast } from "sonner";

const severityColors: Record<string, string> = {
  high: "border-red-500/30 bg-red-500/5",
  medium: "border-amber-500/30 bg-amber-500/5",
  low: "border-blue-500/30 bg-blue-500/5",
};

export default function AlertsPanel() {
  const { data: alerts, isLoading } = useAlertsQuery();
  const resolve = useResolveAlertMutation();

  if (isLoading) return <p className="text-sm text-zinc-400">Loading alerts...</p>;
  if (!alerts || alerts.length === 0) return <p className="text-sm text-zinc-500">No active alerts.</p>;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div key={alert.id} className={`rounded-lg border p-4 ${severityColors[alert.severity] ?? severityColors.low}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-100">{alert.title}</p>
              {alert.description && <p className="mt-1 text-xs text-zinc-400">{alert.description}</p>}
            </div>
            <button
              onClick={() => {
                toast.promise(resolve.mutateAsync(alert.id), {
                  loading: "Resolving...",
                  success: "Alert resolved.",
                  error: "Failed.",
                });
              }}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              Resolve
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <span className="rounded bg-zinc-700 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-300">{alert.severity}</span>
            <span className="rounded bg-zinc-700 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-300">{alert.alert_type}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
