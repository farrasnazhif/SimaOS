"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  Archive,
  X,
  CircleDotDashed,
} from "lucide-react";
import {
  useAlertsQuery,
  useResolveAlertMutation,
  useArchivedAlertsQuery,
  useRestoreAlertMutation,
  Alert,
} from "../queries/alerts-queries";
import { toast } from "sonner";
import Skeleton from "@/components/ui/skeleton";
import Button from "@/components/ui/buttons/button";

const severityConfig: Record<
  string,
  {
    icon: typeof AlertTriangle;
    color: string;
    bg: string;
    border: string;
    label: string;
  }
> = {
  critical: {
    icon: AlertTriangle,
    color: "text-red-500",
    // bg: "bg-[#FFEDEC]",
    bg: "bg-white",
    border: "border-red-100",
    label: "Critical Risk",
  },
  high: {
    icon: AlertTriangle,
    color: "text-red-500",
    // bg: "bg-[#FFEDEC]",
    bg: "bg-white",
    border: "border-red-100",
    label: "Critical Risk",
  },
  warning: {
    icon: CircleDotDashed,
    color: "text-amber-500",
    // bg: "bg-[#FFF0DF]",
    bg: "bg-white",
    border: "border-amber-100",
    label: "Maintenance",
  },
  medium: {
    icon: CircleDotDashed,
    color: "text-amber-500",
    // bg: "bg-[#FFF0DF]",
    bg: "bg-white",
    border: "border-amber-100",
    label: "Maintenance",
  },
  low: {
    icon: Lightbulb,
    color: "text-emerald-600",
    // bg: "bg-[#E9F1ED]",
    bg: "bg-white",
    border: "border-emerald-100",
    label: "Optimization",
  },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AlertsPanel() {
  const { data: alerts, isLoading } = useAlertsQuery();
  const resolve = useResolveAlertMutation();
  const [confirmAlert, setConfirmAlert] = useState<Alert | null>(null);
  const [showArchive, setShowArchive] = useState(false);

  function handleResolve() {
    if (!confirmAlert) return;
    toast.promise(resolve.mutateAsync(confirmAlert.id), {
      loading: "Resolving...",
      success: "Alert resolved.",
      error: "Failed to resolve.",
    });
    setConfirmAlert(null);
  }

  if (isLoading)
    return (
      <div className="space-y-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-[24px] border border-zinc-100 p-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-4 h-5 w-48" />
            <Skeleton className="mt-3 h-4 w-full" />
          </div>
        ))}
      </div>
    );

  return (
    <>
      {!alerts || alerts.length === 0 ? (
        <p className="text-sm text-zinc-500">No active alerts.</p>
      ) : (
        <div className="space-y-5 ">
          {alerts.map((alert) => {
            const config = severityConfig[alert.severity] ?? severityConfig.low;
            const Icon = config.icon;

            return (
              <button
                key={alert.id}
                type="button"
                onClick={() => setConfirmAlert(alert)}
                className={`w-full rounded-2xl border p-6 text-left transition hover:opacity-80 ${config.bg} ${config.border}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`size-4 ${config.color}`} />
                    <h3 className={`text-sm font-semibold ${config.color}`}>
                      {config.label}
                    </h3>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {timeAgo(alert.created_at)}
                  </span>
                </div>

                <h4 className="mt-2 text-md font-semibold text-zinc-900">
                  {alert.title.includes("—")
                    ? alert.title.split("—")[0].trim()
                    : alert.title}
                </h4>
                {alert.title.includes("—") && (
                  <p className="mt-1 text-sm font-medium text-zinc-600">
                    {alert.title.split("—")[1].trim()}
                  </p>
                )}

                {alert.description && (
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                    {alert.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="sticky bottom-0 bg-white pt-4">
        <Button
          onClick={() => setShowArchive(true)}
          className="w-full"
          leftIcon={Archive}
        >
          View Alert Archive
        </Button>
      </div>

      {/* Resolve confirmation modal */}
      {confirmAlert && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={() => setConfirmAlert(null)}
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-zinc-900">
              Resolve Alert
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Are you sure you want to resolve this alert?
            </p>
            <div className="mt-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
              <p className="text-sm font-medium text-zinc-800">
                {confirmAlert.title}
              </p>
              {confirmAlert.description && (
                <p className="mt-1 text-xs text-zinc-500">
                  {confirmAlert.description}
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setConfirmAlert(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleResolve}
                isLoading={resolve.isPending}
              >
                Resolve
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Archive modal */}
      {showArchive && <ArchiveModal onClose={() => setShowArchive(false)} />}
    </>
  );
}

function ArchiveModal({ onClose }: { onClose: () => void }) {
  const { data: archived, isLoading } = useArchivedAlertsQuery();
  const restore = useRestoreAlertMutation();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md max-h-[70vh] flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-zinc-900">
            Archived Alerts
          </h3>
          <button
            onClick={onClose}
            className="text-sm text-zinc-400 hover:text-zinc-600"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-lg border border-zinc-200 p-3">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="mt-2 h-3 w-full" />
                </div>
              ))}
            </div>
          ) : !archived || archived.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-400">
              No archived alerts.
            </p>
          ) : (
            <div className="space-y-3">
              {archived.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-700">
                      {alert.title}
                    </p>
                    {alert.description && (
                      <p className="mt-1 text-xs text-zinc-400">
                        {alert.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      toast.promise(restore.mutateAsync(alert.id), {
                        loading: "Restoring...",
                        success: "Alert restored.",
                        error: "Failed.",
                      });
                    }}
                    className="ml-3 flex shrink-0 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <RotateCcw className="size-3" />
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
