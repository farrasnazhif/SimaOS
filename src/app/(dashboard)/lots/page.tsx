"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  FileText,
  Filter,
  XCircle,
} from "lucide-react";

import Button from "@/components/ui/buttons/button";

import IncomingLotsTable from "@/features/lots/components/incoming-lots-table";
import { useLotsQuery } from "@/features/lots/queries/lots-queries";

export default function LotsPage() {
  const { data: lots } = useLotsQuery();

  const pendingQc = lots?.filter((l) => l.status === "in_qc").length ?? 0;

  const approved = lots?.filter((l) => l.status === "approved").length ?? 0;

  const rejected = lots?.filter((l) => l.status === "rejected").length ?? 0;

  const totalValue = lots?.reduce((sum, l) => sum + Number(l.quantity_kg), 0) ?? 0;

  const kpis = [
    {
      title: "Pending QC",
      value: pendingQc,
      change: "+2 from Yesterday",
      icon: AlertCircle,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-500",
      changeColor: "text-amber-600",
    },
    {
      title: "Approved",
      value: approved,
      change: "+2 from Yesterday",
      icon: CheckCircle2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      changeColor: "text-emerald-600",
    },
    {
      title: "Rejected",
      value: rejected,
      change: "+2 from Yesterday",
      icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      changeColor: "text-red-500",
    },
    {
      title: "Total Stock",
      value: `${totalValue.toLocaleString()} kg`,
      change: "+2 from Yesterday",
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      changeColor: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          Inventory
        </h1>

        <p className="mt-2 text-base text-zinc-500">
          Manage incoming materials and Lots.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBg}`}
                  >
                    <Icon className={`size-6 ${item.iconColor}`} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-zinc-900">
                      {item.title}
                    </h3>

                    <p
                      className={`mt-1 text-sm font-medium ${item.changeColor}`}
                    >
                      {item.change}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between">
                <h2 className="text-5xl font-bold tracking-tight text-zinc-900">
                  {item.value}
                </h2>

                <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 text-zinc-700 transition hover:bg-zinc-50">
                  <ArrowUpRight className="size-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        {/* Table Header */}
        <div className="flex flex-col gap-4 border-b border-zinc-100 px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900">
              Lots
            </h2>

            <div className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
              {lots?.length ?? 0} Entries
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              leftIcon={FileText}
              className="rounded-2xl px-6"
            >
              Export
            </Button>

            <Button
              variant="primary"
              leftIcon={Filter}
              className="rounded-2xl px-6"
            >
              Filter
            </Button>

            <Link href="/batches/new">
              <Button className="rounded-2xl px-6">Create Batch</Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="p-5">
          <IncomingLotsTable />
        </div>
      </div>
    </div>
  );
}
