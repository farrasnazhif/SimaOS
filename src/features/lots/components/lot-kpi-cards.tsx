"use client";

import { AlertCircle, ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
import { useLotsQuery } from "../../lots/queries/lots-queries";
import Link from "next/link";

export default function LotKpiCards() {
  const { data: lots } = useLotsQuery();

  const totalLots = lots?.length ?? 0;
  const pendingQc = lots?.filter((l) => l.status === "in_qc").length ?? 0;
  const rejected = lots?.filter((l) => l.status === "rejected").length ?? 0;
  const rejectionRate =
    totalLots > 0 ? Math.round((rejected / totalLots) * 100) : 0;

  const today = new Date().toISOString().slice(0, 10);
  const approvedToday =
    lots?.filter((l) => l.status === "approved" && l.arrival_date === today)
      .length ?? 0;
  const totalToday = lots?.filter((l) => l.arrival_date === today).length ?? 0;
  const complianceToday =
    totalToday > 0 ? Math.round((approvedToday / totalToday) * 100) : 100;

  // eslint-disable-next-line react-hooks/purity
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const pendingYesterday =
    lots?.filter((l) => l.status === "in_qc" && l.arrival_date <= yesterday)
      .length ?? 0;
  const newPendingSinceYesterday = pendingQc - pendingYesterday;

  // eslint-disable-next-line react-hooks/purity
  const oneWeekAgo = new Date(Date.now() - 7 * 86400000)
    .toISOString()
    .slice(0, 10);
  const lotsThisWeek = lots?.filter((l) => l.arrival_date >= oneWeekAgo) ?? [];
  const rejectedThisWeek = lotsThisWeek.filter(
    (l) => l.status === "rejected",
  ).length;
  const rateThisWeek =
    lotsThisWeek.length > 0
      ? (rejectedThisWeek / lotsThisWeek.length) * 100
      : 0;
  const ratePrior =
    totalLots - lotsThisWeek.length > 0
      ? ((rejected - rejectedThisWeek) / (totalLots - lotsThisWeek.length)) *
        100
      : 0;
  const rateChange = (rateThisWeek - ratePrior).toFixed(1);

  const kpis = [
    {
      title: "Pending QC",
      value: pendingQc,
      change: `${newPendingSinceYesterday >= 0 ? "+" : ""}${newPendingSinceYesterday} from yesterday`,
      insight: `${pendingQc} batch${pendingQc !== 1 ? "es" : ""} pending review`,
      icon: AlertCircle,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-500",
      changeColor: "text-amber-600",
      href: "/lots?status=in_qc",
    },
    {
      title: "Approved Today",
      value: approvedToday,
      change: `${complianceToday}% compliance`,
      insight: `${approvedToday} of ${totalToday} lots today passed QC`,
      icon: CheckCircle2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      changeColor: "text-emerald-600",
      href: "/lots?status=approved",
    },
    {
      title: "Rejection Rate",
      value: `${rejectionRate}%`,
      change: `${Number(rateChange) >= 0 ? "+" : ""}${rateChange}% this week`,
      insight: `${rejected} rejected of ${totalLots} lots`,
      icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      changeColor:
        Number(rateChange) <= 0 ? "text-emerald-600" : "text-red-600",
      href: "/lots?status=rejected",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-3">
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
                href={item.href}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50"
              >
                <ArrowUpRight className="size-5" />
              </Link>
            </div>
            <p className="mt-3 text-xs text-zinc-500">{item.insight}</p>
          </div>
        );
      })}
    </div>
  );
}
