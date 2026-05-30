"use client";

import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Scale,
  XCircle,
} from "lucide-react";
import { useLotsQuery } from "../../lots/queries/lots-queries";
import Link from "next/link";
import Skeleton from "@/components/ui/skeleton";

export default function DashboardKpiCards() {
  const { data: lots, isLoading } = useLotsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-[16px] border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <div className="mt-8">
              <Skeleton className="h-10 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const pendingQc = lots?.filter((l) => l.status === "in_qc").length ?? 0;
  const approved = lots?.filter((l) => l.status === "approved").length ?? 0;
  const rejected = lots?.filter((l) => l.status === "rejected").length ?? 0;
  const totalLots = lots?.length ?? 0;
  const totalWeight =
    lots?.reduce((sum, l) => sum + Number(l.quantity_kg), 0) ?? 0;

  const kpis = [
    {
      title: "Pending QC",
      value: pendingQc,
      change: `${pendingQc} of ${totalLots} lots`,
      icon: AlertCircle,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-500",
      changeColor: "text-amber-600",
      href: "/lots/status/in_qc",
    },
    {
      title: "Approved",
      value: approved,
      change: `${totalLots > 0 ? Math.round((approved / totalLots) * 100) : 0}% approval rate`,
      icon: CheckCircle2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      changeColor: "text-emerald-600",
      href: "/lots/status/approved",
    },
    {
      title: "Rejected",
      value: rejected,
      change: `${totalLots > 0 ? Math.round((rejected / totalLots) * 100) : 0}% rejection rate`,
      icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      changeColor: "text-red-500",
      href: "/lots/status/rejected",
    },
    {
      title: "Total Weight",
      value: `${totalWeight} kg`,
      change: `From ${totalLots} lots`,
      icon: Scale,
      iconBg: "bg-zinc-100",
      iconColor: "text-zinc-600",
      changeColor: "text-zinc-600",
      href: "/lots",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
      {kpis.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="rounded-[16px] border border-emerald-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBg}`}
              >
                <Icon className={`size-6 ${item.iconColor}`} />
              </div>
              <div>
                <h3 className="text-md font-semibold text-zinc-900">
                  {item.title}
                </h3>
                <p className={`mt-1 text-xs font-medium ${item.changeColor}`}>
                  {item.change}
                </p>
              </div>
            </div>
            <div className="mt-8 flex items-end justify-between">
              <h2 className="text-5xl font-bold tracking-tight text-zinc-900">
                {item.value}
              </h2>

              {item.href !== "/lots" && (
                <Link
                  href={item.href}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50"
                >
                  <ArrowUpRight className="size-5" />
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
