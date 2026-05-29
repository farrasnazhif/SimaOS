"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  ListFilter,
} from "lucide-react";

import Button from "@/components/ui/buttons/button";

import { useLotsQuery } from "../queries/lots-queries";

const PAGE_SIZE = 9;

const statusConfig: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  approved: {
    label: "Approved",
    className: "bg-emerald-100/70 text-emerald-700",
  },

  in_qc: {
    label: "Awaiting QC",
    className: "bg-amber-100/70 text-amber-600",
  },

  rejected: {
    label: "Rejected",
    className: "bg-red-100/70 text-red-500",
  },

  in_production: {
    label: "In Production",
    className: "bg-blue-100/70 text-blue-700",
  },

  arriving: {
    label: "Arriving",
    className: "bg-zinc-100 text-zinc-600",
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.arriving;

  return (
    <div
      className={`inline-flex items-center rounded-xl px-4 py-1.5 text-sm font-semibold ${config.className}`}
    >
      {config.label}
    </div>
  );
}

export default function IncomingLotsTable() {
  const { data: lots, isLoading, error } = useLotsQuery();

  const [statusFilter, setStatusFilter] = useState("all");
  const [materialFilter, setMaterialFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

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
      if (statusFilter !== "all" && lot.status !== statusFilter) return false;
      if (materialFilter !== "all" && lot.material_name !== materialFilter)
        return false;
      if (supplierFilter !== "all" && lot.supplier?.name !== supplierFilter)
        return false;
      if (dateFilter === "today" && lot.arrival_date !== todayStr) return false;
      if (dateFilter === "week" && lot.arrival_date < weekAgo) return false;
      if (dateFilter === "month" && lot.arrival_date < monthAgo) return false;
      if (gradeFilter !== "all") {
        const score = lot.qc_inspections?.[0]?.ai_quality_score;
        if (score == null) return false;
        if (gradeFilter === "high" && score < 80) return false;
        if (gradeFilter === "medium" && (score < 60 || score >= 80)) return false;
        if (gradeFilter === "low" && score >= 60) return false;
      }
      return true;
    });
  }, [lots, statusFilter, materialFilter, supplierFilter, dateFilter, gradeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLots.length / PAGE_SIZE));

  const paginatedLots = filteredLots.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  function exportCsv() {
    if (!filteredLots.length) return;

    const header = "Lot ID,Material,Supplier,Arrival Date,Status\n";

    const rows = filteredLots
      .map(
        (lot) =>
          `${lot.lot_number},${lot.material_name},${lot.supplier?.name ?? ""},${lot.arrival_date},${lot.status}`,
      )
      .join("\n");

    const blob = new Blob([header + rows], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "lots-export.csv";

    a.click();

    URL.revokeObjectURL(url);
  }

  if (isLoading) {
    return (
      <div className="rounded-[30px] border border-emerald-100 bg-white p-12 text-center">
        <p className="text-sm text-zinc-500">Loading lots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[30px] border border-red-200 bg-white p-12 text-center">
        <p className="text-sm text-red-500">Failed to load lots.</p>
      </div>
    );
  }

  if (!lots || lots.length === 0) {
    return (
      <div className="rounded-[30px] border border-zinc-200 bg-white p-12 text-center">
        <p className="text-sm text-zinc-500">No lots found.</p>
      </div>
    );
  }

  return (
    <section className="flex min-h-[700px] flex-col overflow-hidden rounded-[32px] border border-emerald-100 bg-white">
      {/* top */}
      <div className="flex flex-col gap-5 px-8 py-7 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-[24px] font-semibold leading-none text-zinc-900">
            Lots
          </h2>

          <div className="rounded-full bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700">
            {filteredLots.length} Entries
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={Download}
            onClick={exportCsv}
          >
            Export
          </Button>

          <div className="relative">
            <Button
              size="sm"
              leftIcon={ListFilter}
              onClick={() => setFilterOpen((prev) => !prev)}
            >
              Filter
            </Button>

            {filterOpen && (
              <div className="absolute right-0 top-12 z-50 w-[220px] max-h-[400px] overflow-y-auto overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
                <div className="p-2">
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Status
                  </p>
                  {[
                    { label: "All Status", value: "all" },
                    { label: "Approved", value: "approved" },
                    { label: "Awaiting QC", value: "in_qc" },
                    { label: "Rejected", value: "rejected" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setStatusFilter(option.value);
                        setPage(1);
                      }}
                      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                        statusFilter === option.value
                          ? "bg-emerald-50 font-semibold text-emerald-700"
                          : "text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}

                  <p className="mt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Material
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMaterialFilter("all");
                      setPage(1);
                    }}
                    className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                      materialFilter === "all"
                        ? "bg-emerald-50 font-semibold text-emerald-700"
                        : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    All Materials
                  </button>
                  {materials.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMaterialFilter(m);
                        setPage(1);
                      }}
                      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                        materialFilter === m
                          ? "bg-emerald-50 font-semibold text-emerald-700"
                          : "text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}

                  <p className="mt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Supplier
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSupplierFilter("all");
                      setPage(1);
                    }}
                    className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                      supplierFilter === "all"
                        ? "bg-emerald-50 font-semibold text-emerald-700"
                        : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    All Suppliers
                  </button>
                  {suppliers.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSupplierFilter(s);
                        setPage(1);
                      }}
                      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                        supplierFilter === s
                          ? "bg-emerald-50 font-semibold text-emerald-700"
                          : "text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {s}
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
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setDateFilter(option.value);
                        setPage(1);
                      }}
                      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                        dateFilter === option.value
                          ? "bg-emerald-50 font-semibold text-emerald-700"
                          : "text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}

                  <p className="mt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Grade
                  </p>
                  {[
                    { label: "All Grades", value: "all" },
                    { label: "High (80+)", value: "high" },
                    { label: "Medium (60–79)", value: "medium" },
                    { label: "Low (&lt;60)", value: "low" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => { setGradeFilter(option.value); setPage(1); }}
                      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                        gradeFilter === option.value
                          ? "bg-emerald-50 font-semibold text-emerald-700"
                          : "text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* table */}
      <div className="flex-1 px-6 pb-6">
        <div className="overflow-hidden rounded-[16px] border border-emerald-100">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-100">
                <th className="px-4 py-5 text-left text-sm font-semibold text-zinc-900">
                  <div className="flex items-center gap-2">
                    Lot ID
                    <ArrowUpDown className="size-4 text-zinc-300" />
                  </div>
                </th>

                <th className="px-4 py-5 text-left text-sm font-semibold text-zinc-900">
                  <div className="flex items-center gap-2">
                    Material
                    <ArrowUpDown className="size-4 text-zinc-300" />
                  </div>
                </th>

                <th className="px-4 py-5 text-left text-sm font-semibold text-zinc-900">
                  <div className="flex items-center gap-2">
                    Grade
                    <ArrowUpDown className="size-4 text-zinc-300" />
                  </div>
                </th>

                <th className="px-4 py-5 text-left text-sm font-semibold text-zinc-900">
                  <div className="flex items-center gap-2">
                    Arrival Date
                    <ArrowUpDown className="size-4 text-zinc-300" />
                  </div>
                </th>

                <th className="px-4 py-5 text-left text-sm font-semibold text-zinc-900">
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="size-4 text-zinc-300" />
                  </div>
                </th>

                <th className="px-4 py-5 text-left text-sm font-semibold text-zinc-900">
                  <div className="flex items-center gap-2">
                    Actions
                    <ArrowUpDown className="size-4 text-zinc-300" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedLots.map((lot, index) => (
                <tr
                  key={lot.id}
                  className={`border-b border-zinc-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-zinc-50"
                  }`}
                >
                  <td className="px-4 py-5 text-sm font-semibold text-zinc-800">
                    {lot.lot_number}
                  </td>

                  <td className="px-4 py-5 text-sm font-medium text-zinc-700">
                    {lot.material_name}
                  </td>

                  <td className="px-4 py-5 text-sm font-semibold text-zinc-700">
                    {lot.qc_inspections?.[0]?.ai_quality_score != null
                      ? `${lot.qc_inspections[0].ai_quality_score}/100`
                      : "-"}
                  </td>

                  <td className="px-4 py-5 text-sm font-medium text-zinc-700">
                    {lot.arrival_date}
                  </td>

                  <td className="px-4 py-5">
                    <StatusBadge status={lot.status} />
                  </td>

                  <td className="px-4 py-5">
                    <Link
                      href={`/lots/${lot.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800 underline"
                    >
                      Details
                      <ArrowUpRight className="size-4 translate-y-[1px]" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* pagination */}
      <div className="mt-auto flex items-center justify-center border-t border-zinc-100 px-6 py-4">
        <div className="flex items-center gap-1.5">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-40"
          >
            <ChevronLeft className="size-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (currentPage) => (
              <button
                key={currentPage}
                onClick={() => setPage(currentPage)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition ${
                  currentPage === page
                    ? "bg-emerald-600 text-white"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {currentPage}
              </button>
            ),
          )}

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-40"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
