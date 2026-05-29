"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  ArrowUpDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  ListFilter,
} from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/breadcrumb";
import Button from "@/components/ui/buttons/button";

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
};

type LotRow = {
  id: string;
  lot_number: string;
  material_name: string;
  quantity_kg: number;
  arrival_date: string;
  status: string;
  supplier: { name: string } | null;
  qc_inspections: { ai_quality_score: number }[];
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
      return data as LotRow[];
    },
  });
}

type ChartGroupBy = "material" | "supplier";

export default function LotStatusDetailPage({ status }: { status: string }) {
  const { data: lots, isLoading } = useLotsbyStatusQuery(status);
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    heading: status,
    description: "",
    badgeBg: "bg-zinc-100",
    badgeText: "text-zinc-600",
  };

  // Table filters
  const [materialFilter, setMaterialFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Chart filter
  const [chartGroupBy, setChartGroupBy] = useState<ChartGroupBy>("material");
  const [chartGradeFilter, setChartGradeFilter] = useState("all");
  const [chartFilterOpen, setChartFilterOpen] = useState(false);

  const materials = useMemo(() => {
    if (!lots) return [];
    return [...new Set(lots.map((l) => l.material_name))].sort();
  }, [lots]);

  const suppliers = useMemo(() => {
    if (!lots) return [];
    return [
      ...new Set(lots.map((l) => l.supplier?.name).filter(Boolean)),
    ].sort() as string[];
  }, [lots]);

  const filteredLots = useMemo(() => {
    if (!lots) return [];
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now.getTime() - 7 * 86400000)
      .toISOString()
      .slice(0, 10);
    const monthAgo = new Date(now.getTime() - 30 * 86400000)
      .toISOString()
      .slice(0, 10);

    return lots.filter((lot) => {
      if (materialFilter !== "all" && lot.material_name !== materialFilter)
        return false;
      if (supplierFilter !== "all" && lot.supplier?.name !== supplierFilter)
        return false;
      if (dateFilter === "today" && lot.arrival_date !== todayStr) return false;
      if (dateFilter === "week" && lot.arrival_date < weekAgo) return false;
      if (dateFilter === "month" && lot.arrival_date < monthAgo) return false;
      if (
        dateFilter !== "all" &&
        dateFilter !== "today" &&
        dateFilter !== "week" &&
        dateFilter !== "month" &&
        lot.arrival_date !== dateFilter
      )
        return false;
      if (gradeFilter !== "all") {
        const score = lot.qc_inspections?.[0]?.ai_quality_score;
        if (score == null) return false;
        if (gradeFilter === "high" && score < 80) return false;
        if (gradeFilter === "medium" && (score < 60 || score >= 80))
          return false;
        if (gradeFilter === "low" && score >= 60) return false;
      }
      return true;
    });
  }, [lots, materialFilter, supplierFilter, dateFilter, gradeFilter]);

  const PAGE_SIZE = 5;
  const totalPages = Math.max(1, Math.ceil(filteredLots.length / PAGE_SIZE));
  const paginatedLots = filteredLots.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // Chart data
  const chartData = useMemo(() => {
    if (!filteredLots.length) return [];
    const grouped = new Map<string, { totalScore: number; count: number }>();
    for (const lot of filteredLots) {
      const score = lot.qc_inspections?.[0]?.ai_quality_score;
      if (score == null) continue;
      if (chartGradeFilter === "high" && score < 80) continue;
      if (chartGradeFilter === "medium" && (score < 60 || score >= 80))
        continue;
      if (chartGradeFilter === "low" && score >= 60) continue;
      const key =
        chartGroupBy === "material"
          ? lot.material_name
          : (lot.supplier?.name ?? "Unknown");
      const existing = grouped.get(key);
      if (existing) {
        existing.totalScore += score;
        existing.count += 1;
      } else {
        grouped.set(key, { totalScore: score, count: 1 });
      }
    }
    return Array.from(grouped.entries()).map(
      ([label, { totalScore, count }]) => ({
        label,
        avgScore: Math.round(totalScore / count),
        count,
      }),
    );
  }, [filteredLots, chartGroupBy, chartGradeFilter]);

  const lowest =
    chartData.length > 1
      ? chartData.reduce((a, b) => (a.avgScore < b.avgScore ? a : b))
      : null;
  const highest =
    chartData.length > 1
      ? chartData.reduce((a, b) => (a.avgScore > b.avgScore ? a : b))
      : null;

  // Info stats
  const totalWeight = filteredLots.reduce(
    (sum, l) => sum + Number(l.quantity_kg),
    0,
  );
  const scores = filteredLots
    .flatMap((l) => l.qc_inspections.map((q) => q.ai_quality_score))
    .filter(Boolean);
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  const highestScore = scores.length ? Math.max(...scores) : null;
  const lowestScore = scores.length ? Math.min(...scores) : null;
  const avgWeight = filteredLots.length
    ? Math.round(totalWeight / filteredLots.length)
    : 0;
  const highGradeCount = filteredLots.filter(
    (l) => (l.qc_inspections?.[0]?.ai_quality_score ?? 0) >= 80,
  ).length;
  const lowGradeCount = filteredLots.filter(
    (l) => (l.qc_inspections?.[0]?.ai_quality_score ?? 0) < 60,
  ).length;
  const foreignMatterLots = filteredLots.filter(
    (l) =>
      l.qc_inspections?.[0]?.ai_quality_score != null &&
      l.qc_inspections[0].ai_quality_score < 50,
  ).length;
  const earliestArrival = filteredLots.length
    ? filteredLots[filteredLots.length - 1]?.arrival_date
    : null;
  const latestArrival = filteredLots.length
    ? filteredLots[0]?.arrival_date
    : null;
  const topMaterial = (() => {
    const counts = new Map<string, number>();
    filteredLots.forEach((l) =>
      counts.set(l.material_name, (counts.get(l.material_name) ?? 0) + 1),
    );
    let top = "—";
    let max = 0;
    counts.forEach((c, m) => {
      if (c > max) {
        max = c;
        top = m;
      }
    });
    return top;
  })();
  const topSupplier = (() => {
    const counts = new Map<string, number>();
    filteredLots.forEach((l) => {
      const n = l.supplier?.name;
      if (n) counts.set(n, (counts.get(n) ?? 0) + 1);
    });
    let top = "—";
    let max = 0;
    counts.forEach((c, s) => {
      if (c > max) {
        max = c;
        top = s;
      }
    });
    return top;
  })();

  return (
    <div>
      <Breadcrumb lastLabel={config.heading} />

      <div className="mb-6">
        <h1 className="text-[32px] font-semibold tracking-tight leading-none text-zinc-900">
          {config.heading}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{config.description}</p>
      </div>

      <div className="space-y-6">
        {/* Table */}
        <section className="flex min-h-[600px] flex-col overflow-hidden rounded-[32px] border border-emerald-100 bg-white">
          <div className="flex flex-col gap-5 px-8 py-7 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-[24px] font-semibold leading-none text-zinc-900">
                Lots
              </h2>
              <div className="rounded-full bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700">
                {isLoading ? "..." : `${filteredLots.length} Entries`}
              </div>
            </div>

            <div className="relative">
              <Button
                size="sm"
                leftIcon={ListFilter}
                onClick={() => setFilterOpen((prev) => !prev)}
              >
                Filter
              </Button>

              {filterOpen && (
                <div className="absolute right-0 top-12 z-50 w-[220px] max-h-[400px] overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-xl">
                  <div className="p-2">
                    <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Material
                    </p>
                    {[
                      { label: "All Materials", value: "all" },
                      ...materials.map((m) => ({ label: m, value: m })),
                    ].map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => {
                          setMaterialFilter(o.value);
                          setPage(1);
                        }}
                        className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${materialFilter === o.value ? "bg-emerald-50 font-semibold text-emerald-700" : "text-zinc-600 hover:bg-zinc-50"}`}
                      >
                        {o.label}
                      </button>
                    ))}

                    <p className="mt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Supplier
                    </p>
                    {[
                      { label: "All Suppliers", value: "all" },
                      ...suppliers.map((s) => ({ label: s, value: s })),
                    ].map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => {
                          setSupplierFilter(o.value);
                          setPage(1);
                        }}
                        className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${supplierFilter === o.value ? "bg-emerald-50 font-semibold text-emerald-700" : "text-zinc-600 hover:bg-zinc-50"}`}
                      >
                        {o.label}
                      </button>
                    ))}

                    <p className="mt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Arrival Date
                    </p>
                    {[
                      { label: "All Time", value: "all" },
                      { label: "Today", value: "today" },
                      { label: "This Week", value: "week" },
                      { label: "This Month", value: "month" },
                    ].map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => {
                          setDateFilter(o.value);
                          setPage(1);
                        }}
                        className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${dateFilter === o.value ? "bg-emerald-50 font-semibold text-emerald-700" : "text-zinc-600 hover:bg-zinc-50"}`}
                      >
                        {o.label}
                      </button>
                    ))}
                    <div className="px-3 py-2">
                      <input
                        type="date"
                        value={
                          !["all", "today", "week", "month"].includes(
                            dateFilter,
                          )
                            ? dateFilter
                            : ""
                        }
                        onChange={(e) => {
                          setDateFilter(e.target.value || "all");
                          setPage(1);
                        }}
                        className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm text-zinc-700 outline-none focus:border-emerald-500"
                      />
                    </div>

                    <p className="mt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Grade
                    </p>
                    {[
                      { label: "All Grades", value: "all" },
                      { label: "High (80+)", value: "high" },
                      { label: "Medium (60–79)", value: "medium" },
                      { label: "Low (<60)", value: "low" },
                    ].map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => {
                          setGradeFilter(o.value);
                          setPage(1);
                        }}
                        className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${gradeFilter === o.value ? "bg-emerald-50 font-semibold text-emerald-700" : "text-zinc-600 hover:bg-zinc-50"}`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 px-6 pb-6">
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
                        colSpan={6}
                        className="px-4 py-8 text-center text-sm text-zinc-400"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : filteredLots.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-sm text-zinc-400"
                      >
                        No lots found.
                      </td>
                    </tr>
                  ) : (
                    paginatedLots.map((lot, index) => (
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
                            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 underline hover:text-emerald-800"
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

          {/* Pagination */}
          <div className="mt-auto flex items-center justify-center border-t border-zinc-100 px-6 py-4">
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition ${p === page ? "bg-emerald-600 text-white" : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"}`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-40"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Chart + Info */}
        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-12 overflow-hidden rounded-[32px] border border-emerald-100 bg-white lg:col-span-8">
            <div className="flex items-center justify-between px-8 py-7">
              <h2 className="text-[24px] font-semibold leading-none text-zinc-900">
                Quality Scores{" "}
                {chartGroupBy === "material" ? "by Material" : "by Supplier"}
              </h2>
              <div className="relative">
                <Button
                  size="sm"
                  leftIcon={ListFilter}
                  onClick={() => setChartFilterOpen((prev) => !prev)}
                >
                  {chartGroupBy === "material" ? "By Material" : "By Supplier"}
                </Button>
                {chartFilterOpen && (
                  <div className="absolute right-0 top-12 z-50 w-[190px] max-h-[300px] overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-xl">
                    <div className="p-2">
                      <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Group By
                      </p>
                      {(
                        [
                          { label: "By Material", value: "material" },
                          { label: "By Supplier", value: "supplier" },
                        ] as const
                      ).map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => {
                            setChartGroupBy(o.value);
                          }}
                          className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${chartGroupBy === o.value ? "bg-emerald-50 font-semibold text-emerald-700" : "text-zinc-600 hover:bg-zinc-50"}`}
                        >
                          {o.label}
                        </button>
                      ))}
                      <p className="mt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Grade
                      </p>
                      {[
                        { label: "All Grades", value: "all" },
                        { label: "High (80+)", value: "high" },
                        { label: "Medium (60–79)", value: "medium" },
                        { label: "Low (<60)", value: "low" },
                      ].map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => {
                            setChartGradeFilter(o.value);
                          }}
                          className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${chartGradeFilter === o.value ? "bg-emerald-50 font-semibold text-emerald-700" : "text-zinc-600 hover:bg-zinc-50"}`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="rounded-[18px] border border-emerald-100 bg-zinc-50 p-6">
                {chartData.length === 0 ? (
                  <div className="flex h-[280px] items-center justify-center text-zinc-400">
                    No data available.
                  </div>
                ) : (
                  <div className="flex gap-2" style={{ height: 280 }}>
                    <div className="relative flex flex-1 items-end gap-4">
                      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="border-t border-zinc-200/60"
                          />
                        ))}
                      </div>
                      {chartData.map((item) => (
                        <div
                          key={item.label}
                          className="group relative flex flex-1 flex-col items-center gap-2 "
                          style={{ height: "100%" }}
                        >
                          <div className="relative flex w-full flex-1 items-end">
                            <div
                              className={`relative w-full min-h-[8px] rounded-t-2xl transition-all group-hover:opacity-80 ${
                                item.avgScore < 60
                                  ? "bg-red-500"
                                  : item.avgScore < 75
                                    ? "bg-amber-500"
                                    : "bg-emerald-600"
                              }`}
                              style={{ height: `${item.avgScore}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-bold text-white shadow-lg group-hover:block">
                                {item.avgScore}
                              </div>
                            </div>
                          </div>
                          <p className="text-center text-sm font-medium text-zinc-700">
                            {item.label}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {item.count} {item.count === 1 ? "lot" : "lots"}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col justify-between py-1 text-left text-xs text-zinc-400 ml-4">
                      <span>100</span>
                      <span>75</span>
                      <span>50</span>
                      <span>25</span>
                      <span>0</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

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
                  {filteredLots.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total Weight</p>
                <p className="mt-1 text-md font-bold text-zinc-900">
                  {totalWeight.toLocaleString()} kg
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Avg Weight</p>
                <p className="mt-1 text-md font-bold text-zinc-900">
                  {avgWeight} kg
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
                <p className="text-sm text-zinc-500">Top Material</p>
                <p className="mt-1 text-md font-bold text-zinc-900">
                  {topMaterial}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Top Supplier</p>
                <p className="mt-1 text-md font-bold text-zinc-900">
                  {topSupplier}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Earliest Arrival</p>
                <p className="mt-1 text-md font-bold text-zinc-900">
                  {earliestArrival ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Latest Arrival</p>
                <p className="mt-1 text-md font-bold text-zinc-900">
                  {latestArrival ?? "—"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
