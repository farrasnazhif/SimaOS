import { cn } from "@/lib/utils";

const statusConfig: Record<string, { className: string; label: string }> = {
  approved: { className: "bg-emerald-100 text-emerald-600", label: "Approved" },
  rejected: { className: "bg-red-100 text-red-600", label: "Rejected" },
  in_qc: { className: "bg-amber-100 text-amber-600", label: "Awaiting QC" },
  in_production: { className: "bg-blue-100 text-blue-600", label: "In Production" },
  arriving: { className: "bg-zinc-100 text-zinc-600", label: "Arriving" },
};

export default function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = statusConfig[status] ?? { className: "bg-zinc-100 text-zinc-600", label: status };
  return (
    <div className={cn("inline-flex items-center rounded-xl px-4 py-1.5 text-sm font-semibold", config.className, className)}>
      {config.label}
    </div>
  );
}
