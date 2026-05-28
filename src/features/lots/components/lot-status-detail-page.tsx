"use client";

import { useQuery } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ArrowUpDown, ArrowUpRight, Download, Filter } from "lucide-react";
import Button from "@/components/ui/buttons/button";
import Link from "next/link";
import Breadcrumb from "@/components/ui/breadcrumb";

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    heading: string;
    description: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  in_qc: {
    label: "Awaiting QC",
    heading: "Pending QC",
    description: "Lots pending quality check.",
    badgeBg: "bg-amber-100/70",
    badgeText: "text-amber-600",
  },
  approved: {
    label: "Approved",
    heading: "Approved Lots",
    description: "Lots that passed quality control.",
    badgeBg: "bg-emerald-100/70",
    badgeText: "text-emerald-600",
  },
  rejected: {
    label: "Rejected",
    heading: "Rejected Lots",
    description: "Lots that failed quality control.",
    badgeBg: "bg-red-100/70",
    badgeText: "text-red-600",
  },
  in_production: {
    label: "In Production",
    heading: "In Production",
    description: "Lots currently being processed.",
    badgeBg: "bg-blue-100/70",
    badgeText: "text-blue-600",
  },
  arriving: {
    label: "Arriving",
    heading: "Arriving Lots",
    description: "Lots in transit to warehouse.",
    badgeBg: "bg-zinc-100",
    badgeText: "text-zinc-600",
  },
};

function useLotsbyStatusQuery(status: string) {
  return useQuery({
    queryKey: ["lots", "status", status],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("lots")
        .select(
          "id, lot_number, material_name, quantity_kg, arrival_date, status, supplier:suppliers(name), qc_inspections(ai_quality_score)",
        )
        .eq("status", status)
        .order("arrival_date", { ascending: false });
      if (error) throw error;
      return data as {
        id: string;
        lot_number: string;
        material_name: string;
        quantity_kg: number;
        arrival_date: string;
        status: string;
        supplier: { name: string } | null;
        qc_inspections: { ai_quality_score: number }[];
      }[];
    },
  });
}

function DailyChart({ lots }: { lots: { arrival_date: string }[] }) {
  // Group lots by date for last 14 days
  const today = new Date();
  const days: { label: string; count: number }[] = [];

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const count = lots.filter((l) => l.arrival_date === dateStr).length;
    days.push({
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count,
    });
  }

  const max = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="flex h-[280px] items-end gap-2 px-2">
      {days.map((day) => (
        <div
          key={day.label}
          className="flex flex-1 flex-col items-center gap-2"
        >
          <div className="relative w-full flex-1 flex items-end">
            <div
              className="w-full rounded-t-lg bg-emerald-500 transition-all"
              style={{
                height: `${(day.count / max) * 100}%`,
                minHeight: day.count > 0 ? "8px" : "0",
              }}
            />
          </div>
          <span className="text-[10px] text-zinc-400">
            {day.label.split(" ")[1]}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function LotStatusDetailPage({ status }: { status: string }) {
  const { data: lots, isLoading } = useLotsbyStatusQuery(status);
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    heading: status,
    description: "",
    badgeBg: "bg-zinc-100",
    badgeText: "text-zinc-600",
  };

  const totalWeight =
    lots?.reduce((sum, l) => sum + Number(l.quantity_kg), 0) ?? 0;
  const scores =
    lots
      ?.flatMap((l) => l.qc_inspections.map((q) => q.ai_quality_score))
      .filter(Boolean) ?? [];
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  const highestScore = scores.length ? Math.max(...scores) : null;
  const lowestScore = scores.length ? Math.min(...scores) : null;
  const suppliers = [
    ...new Set(lots?.map((l) => l.supplier?.name).filter(Boolean) ?? []),
  ];
  const materials = [...new Set(lots?.map((l) => l.material_name) ?? [])];
  const latestArrival = lots?.length ? lots[0].arrival_date : null;

  return (
    <div>
      <Breadcrumb lastLabel={config.heading} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[32px] font-semibold tracking-tight leading-none text-zinc-900">
          {config.heading}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{config.description}</p>
      </div>

      <div className="space-y-6">
        {/* Table section */}
        <section className="overflow-hidden rounded-[32px] border border-emerald-100 bg-white">
          <div className="flex flex-col gap-5 px-8 py-7 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-[24px] font-semibold leading-none text-zinc-900">
                Lots
              </h2>
              <div className="rounded-full bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700">
                {isLoading ? "..." : `${lots?.length ?? 0} Entries`}
              </div>
            </div>

            {/* <div className="flex items-center gap-3">
              <Button variant="primary" size="sm" leftIcon={Download}>
                Export
              </Button>
              <Button size="sm" leftIcon={Filter}>
                Filter
              </Button>
            </div> */}
          </div>

          <div className="px-6 pb-6">
            <div className="overflow-hidden rounded-[18px] border border-emerald-100">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-zinc-100">
                    {[
                      "Lot ID",
                      "Material",
                      "Grade",
                      "Arrival Date",
                      "Status",
                      "Actions",
                    ].map((item) => (
                      <th
                        key={item}
                        className="px-4 py-5 text-left text-sm font-semibold text-zinc-900"
                      >
                        <div className="flex items-center gap-2">
                          {item}
                          <ArrowUpDown className="size-4 text-zinc-300" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-sm text-zinc-400"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : lots?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-sm text-zinc-400"
                      >
                        No lots found.
                      </td>
                    </tr>
                  ) : (
                    lots?.map((lot, index) => (
                      <tr
                        key={lot.id}
                        className={`border-b border-zinc-100 ${index % 2 === 0 ? "bg-white" : "bg-zinc-50"}`}
                      >
                        <td className="px-4 py-5 text-sm font-semibold text-zinc-800">
                          {lot.lot_number}
                        </td>
                        <td className="px-4 py-5 text-sm font-medium text-zinc-700">
                          {lot.material_name}
                        </td>
                        <td className="px-4 py-5 text-sm font-medium text-zinc-700">
                          {lot.qc_inspections[0]?.ai_quality_score != null
                            ? `${lot.qc_inspections[0].ai_quality_score}/100`
                            : "-"}
                        </td>
                        <td className="px-4 py-5 text-sm font-medium text-zinc-700">
                          {lot.arrival_date}
                        </td>
                        <td className="px-4 py-5">
                          <div
                            className={`inline-flex items-center rounded-xl px-4 py-1.5 text-sm font-semibold ${config.badgeBg} ${config.badgeText}`}
                          >
                            {config.label}
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <Link
                            href={`/lots/${lot.id}`}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                          >
                            Details
                            <ArrowUpRight className="size-4 translate-y-[1px]" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Bottom section */}
        <div className="grid grid-cols-12 gap-6">
          {/* Graph */}
          <section className="col-span-12 overflow-hidden rounded-[32px] border border-emerald-100 bg-white lg:col-span-8">
            <div className="px-8 py-7">
              <h2 className="text-[24px] font-semibold leading-none text-zinc-900">
                Daily Arrivals (Last 14 Days)
              </h2>
            </div>
            <div className="px-6 pb-6">
              <div className="rounded-[18px] border border-emerald-100 bg-zinc-50 p-4">
                {lots ? (
                  <DailyChart lots={lots} />
                ) : (
                  <div className="h-[280px]" />
                )}
              </div>
            </div>
          </section>

          {/* Information */}
          <section className="col-span-12 overflow-hidden rounded-[32px] border border-emerald-100 bg-white lg:col-span-4">
            <div className="px-8 py-7">
              <h2 className="text-[24px] font-semibold leading-none text-zinc-900">
                Information
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-0 gap-y-6 px-8 pb-8">
              <div>
                <p className="text-sm text-zinc-500">Total Lots</p>
                <p className="mt-1 text-md font-bold text-zinc-900">
                  {lots?.length ?? 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Total Weight</p>
                <p className="mt-1 text-md font-bold text-zinc-900">
                  {totalWeight.toLocaleString()} kg
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Avg QC Score</p>
                <p className="mt-1 text-md font-bold text-zinc-900">
                  {avgScore || "—"}/100
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Highest Score</p>
                <p className="mt-1 text-md font-bold text-zinc-900">
                  {highestScore ?? "—"}/100
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Lowest Score</p>
                <p className="mt-1 text-md font-bold text-zinc-900">
                  {lowestScore ?? "—"}/100
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Avg Weight</p>
                <p className="mt-1 text-md font-bold text-zinc-900">
                  {lots?.length ? Math.round(totalWeight / lots.length) : "—"}{" "}
                  kg
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Latest Arrival</p>
                <p className="mt-1 text-md font-bold text-zinc-900">
                  {latestArrival ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Materials</p>
                <p className="mt-1 text-md font-bold text-zinc-900">
                  {materials.length}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
