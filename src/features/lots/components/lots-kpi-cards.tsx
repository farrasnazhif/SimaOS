"use client";

import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Factory,
  Truck,
  XCircle,
} from "lucide-react";
import { useLotsQuery } from "../queries/lots-queries";
import Link from "next/link";

export default function LotsKpiCards() {
  const { data: lots } = useLotsQuery();

  const pendingQc = lots?.filter((l) => l.status === "in_qc").length ?? 0;
  const approved = lots?.filter((l) => l.status === "approved").length ?? 0;
  const rejected = lots?.filter((l) => l.status === "rejected").length ?? 0;
  const inProduction =
    lots?.filter((l) => l.status === "in_production").length ?? 0;
  const arriving = lots?.filter((l) => l.status === "arriving").length ?? 0;
  const totalLots = lots?.length ?? 0;

  const kpis = [
    {
      title: "Pending QC",
      value: pendingQc,
      change: `${pendingQc} of ${totalLots} lots`,
      icon: AlertCircle,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-500",
      changeColor: "text-amber-600",
      status: "in_qc",
    },
    {
      title: "Approved",
      value: approved,
      change: `${totalLots > 0 ? Math.round((approved / totalLots) * 100) : 0}% approval rate`,
      icon: CheckCircle2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      changeColor: "text-emerald-600",
      status: "approved",
    },
    {
      title: "Rejected",
      value: rejected,
      change: `${totalLots > 0 ? Math.round((rejected / totalLots) * 100) : 0}% rejection rate`,
      icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      changeColor: "text-red-500",
      status: "rejected",
    },
    {
      title: "In Production",
      value: inProduction,
      change: `${inProduction} active`,
      icon: Factory,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      changeColor: "text-blue-600",
      status: "in_production",
    },
    {
      title: "Arriving",
      value: arriving,
      change: `${arriving} incoming`,
      icon: Truck,
      iconBg: "bg-zinc-100",
      iconColor: "text-zinc-600",
      changeColor: "text-zinc-600",
      status: "arriving",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
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

              <Link
                href={`/lots/status/${item.status}`}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50"
              >
                <ArrowUpRight className="size-5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
