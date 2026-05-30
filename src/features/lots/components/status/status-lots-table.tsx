"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ListFilter,
} from "lucide-react";
import Button from "@/components/ui/buttons/button";
import Skeleton from "@/components/ui/skeleton";
import { LotRow, StatusConfig } from "./types";

const PAGE_SIZE = 5;

type Props = {
  lots: LotRow[] | undefined;
  isLoading: boolean;
  config: StatusConfig;
};

export default function StatusLotsTable({ lots, isLoading, config }: Props) {
  const [materialFilter, setMaterialFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [gradeMin, setGradeMin] = useState("");
  const [gradeMax, setGradeMax] = useState("");
  const [weightFilter, setWeightFilter] = useState("all");
  const [weightMin, setWeightMin] = useState("");
  const [weightMax, setWeightMax] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

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
      if (gradeMin || gradeMax) {
        const score = lot.qc_inspections?.[0]?.ai_quality_score;
        if (score == null) return false;
        if (gradeMin && score < Number(gradeMin)) return false;
        if (gradeMax && score > Number(gradeMax)) return false;
      }
      if (weightFilter !== "all") {
        const w = Number(lot.quantity_kg);
        if (weightFilter === "light" && w >= 100) return false;
        if (weightFilter === "medium" && (w < 100 || w >= 200)) return false;
        if (weightFilter === "heavy" && w < 200) return false;
      }
      if (weightMin || weightMax) {
        const w = Number(lot.quantity_kg);
        if (weightMin && w < Number(weightMin)) return false;
        if (weightMax && w > Number(weightMax)) return false;
      }
      return true;
    });
  }, [
    lots,
    materialFilter,
    supplierFilter,
    dateFilter,
    gradeFilter,
    gradeMin,
    gradeMax,
    weightFilter,
    weightMin,
    weightMax,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredLots.length / PAGE_SIZE));
  const paginatedLots = filteredLots.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <section className="flex min-h-[600px] flex-col overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-sm">
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
                      !["all", "today", "week", "month"].includes(dateFilter)
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
                      setGradeMin("");
                      setGradeMax("");
                      setPage(1);
                    }}
                    className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${gradeFilter === o.value && !gradeMin && !gradeMax ? "bg-emerald-50 font-semibold text-emerald-700" : "text-zinc-600 hover:bg-zinc-50"}`}
                  >
                    {o.label}
                  </button>
                ))}
                <div className="flex gap-2 px-3 py-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    max="100"
                    value={gradeMin}
                    onChange={(e) => {
                      setGradeMin(e.target.value);
                      setGradeFilter("all");
                      setPage(1);
                    }}
                    className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm text-zinc-700 outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    max="100"
                    value={gradeMax}
                    onChange={(e) => {
                      setGradeMax(e.target.value);
                      setGradeFilter("all");
                      setPage(1);
                    }}
                    className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm text-zinc-700 outline-none focus:border-emerald-500"
                  />
                </div>

                <p className="mt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Weight
                </p>
                {[
                  { label: "All Weights", value: "all" },
                  { label: "Light (<100 kg)", value: "light" },
                  { label: "Medium (100–199 kg)", value: "medium" },
                  { label: "Heavy (200+ kg)", value: "heavy" },
                ].map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => {
                      setWeightFilter(o.value);
                      setWeightMin("");
                      setWeightMax("");
                      setPage(1);
                    }}
                    className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${weightFilter === o.value && !weightMin && !weightMax ? "bg-emerald-50 font-semibold text-emerald-700" : "text-zinc-600 hover:bg-zinc-50"}`}
                  >
                    {o.label}
                  </button>
                ))}
                <div className="flex gap-2 px-3 py-2">
                  <input
                    type="number"
                    placeholder="Min kg"
                    min="0"
                    value={weightMin}
                    onChange={(e) => {
                      setWeightMin(e.target.value);
                      setWeightFilter("all");
                      setPage(1);
                    }}
                    className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm text-zinc-700 outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Max kg"
                    min="0"
                    value={weightMax}
                    onChange={(e) => {
                      setWeightMax(e.target.value);
                      setWeightFilter("all");
                      setPage(1);
                    }}
                    className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm text-zinc-700 outline-none focus:border-emerald-500"
                  />
                </div>
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
                  "Weight",
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
                Array.from({ length: 5 }).map((_, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-zinc-50"}
                  >
                    <td className="px-4 py-5">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-5">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="px-4 py-5">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-4 py-5">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-4 py-5">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-5">
                      <Skeleton className="h-6 w-20 rounded-xl" />
                    </td>
                    <td className="px-4 py-5">
                      <Skeleton className="h-4 w-14" />
                    </td>
                  </tr>
                ))
              ) : filteredLots.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
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
                      {lot.quantity_kg} kg
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
  );
}
