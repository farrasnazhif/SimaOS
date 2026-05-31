"use client";

import * as React from "react";
import { Lightbulb, ListFilter } from "lucide-react";

import Button from "@/components/ui/buttons/button";
import PageHeader from "@/components/ui/page-header";
import Card from "@/components/ui/card";
import AlertsPanel from "@/features/alerts/components/alerts-panel";
import { useLotsQuery, Lot } from "@/features/lots/queries/lots-queries";
import DashboardKpiCards from "@/features/dashboard/components/dashboard-kpi-cards";

type StatusFilter = "all" | "approved" | "in_qc" | "rejected";
type GroupBy = "material" | "supplier";

const filterOptions: {
  label: string;
  value: string;
  group: "status" | "groupBy" | "grade";
}[] = [
  { label: "All Statuses", value: "all", group: "status" },
  { label: "Approved", value: "approved", group: "status" },
  { label: "Pending QC", value: "in_qc", group: "status" },
  { label: "Rejected", value: "rejected", group: "status" },
  { label: "By Material", value: "material", group: "groupBy" },
  { label: "By Supplier", value: "supplier", group: "groupBy" },
  { label: "All Grades", value: "all", group: "grade" },
  { label: "High (80+)", value: "high", group: "grade" },
  { label: "Medium (50–79)", value: "medium", group: "grade" },
  { label: "Low (<50)", value: "low", group: "grade" },
];

function useChartData(
  filter: StatusFilter,
  groupBy: GroupBy,
  gradeFilter: string,
) {
  const { data: lots } = useLotsQuery();

  if (!lots) return [];

  const filtered: Lot[] =
    filter === "all" ? lots : lots.filter((l) => l.status === filter);
  const grouped = new Map<string, { totalScore: number; count: number }>();

  for (const lot of filtered) {
    const score = lot.qc_inspections?.[0]?.ai_quality_score;
    if (score == null) continue;
    if (gradeFilter === "high" && score < 80) continue;
    if (gradeFilter === "medium" && (score < 50 || score >= 80)) continue;
    if (gradeFilter === "low" && score >= 50) continue;

    const key =
      groupBy === "material"
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
}

export default function DashboardView() {
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [groupBy, setGroupBy] = React.useState<GroupBy>("material");
  const [gradeFilter, setGradeFilter] = React.useState("all");
  const [filterOpen, setFilterOpen] = React.useState(false);
  const chartData = useChartData(statusFilter, groupBy, gradeFilter);

  const lowest =
    chartData.length > 1
      ? chartData.reduce((a, b) => (a.avgScore < b.avgScore ? a : b))
      : null;
  const highest =
    chartData.length > 1
      ? chartData.reduce((a, b) => (a.avgScore > b.avgScore ? a : b))
      : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Track inventory status, quality trends, and critical operational alerts."
      />

      <DashboardKpiCards />

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-[24px] font-semibold text-zinc-900">
                Quality Trends
              </h2>
              <p className="mt-1 text-base text-zinc-500">
                Average AI quality score{" "}
                {groupBy === "material" ? "by material type" : "by supplier"}
              </p>
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
                <div className="absolute right-0 top-12 z-50 w-[190px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
                  <div className="p-2">
                    <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Status
                    </p>
                    {filterOptions
                      .filter((o) => o.group === "status")
                      .map((option) => {
                        const isActive = statusFilter === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setStatusFilter(option.value as StatusFilter);
                              setFilterOpen(false);
                            }}
                            className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                              isActive
                                ? "bg-emerald-50 font-semibold text-emerald-700"
                                : "text-zinc-600 hover:bg-zinc-50"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    <p className="mt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Group By
                    </p>
                    {filterOptions
                      .filter((o) => o.group === "groupBy")
                      .map((option) => {
                        const isActive = groupBy === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setGroupBy(option.value as GroupBy);
                              setFilterOpen(false);
                            }}
                            className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                              isActive
                                ? "bg-emerald-50 font-semibold text-emerald-700"
                                : "text-zinc-600 hover:bg-zinc-50"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    <p className="mt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Grade
                    </p>
                    {filterOptions
                      .filter((o) => o.group === "grade")
                      .map((option) => {
                        const isActive = gradeFilter === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setGradeFilter(option.value);
                              setFilterOpen(false);
                            }}
                            className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                              isActive
                                ? "bg-emerald-50 font-semibold text-emerald-700"
                                : "text-zinc-600 hover:bg-zinc-50"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 rounded-md border border-zinc-200 p-6">
            {chartData.length === 0 ? (
              <div className="flex h-[360px] items-center justify-center text-zinc-400">
                No QC data available yet.
              </div>
            ) : (
              <div className="flex gap-2" style={{ height: 360 }}>
                {/* Bars */}
                <div className="relative flex flex-1 items-end gap-4">
                  {/* Grid lines */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="border-t border-zinc-100" />
                    ))}
                  </div>
                  {chartData.map((item) => (
                    <div
                      key={item.label}
                      className="group relative flex flex-1 flex-col items-center gap-2"
                      style={{ height: "100%" }}
                    >
                      <div className="relative flex w-full flex-1 items-end">
                        <div
                          className={`relative w-full min-h-[8px] rounded-t-xl transition-all group-hover:opacity-80 ${
                            item.avgScore < 50
                              ? "bg-[#98DEB9]"
                              : // red and amber-500
                                item.avgScore < 75
                                ? "bg-[#3BB377]"
                                : "bg-emerald-600"
                          }`}
                          style={{ height: `${item.avgScore}%` }}
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-bold text-white shadow-lg group-hover:block">
                            {item.avgScore}
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-xs truncate font-medium text-zinc-700 ">
                        {item.label}
                      </p>
                      <p className="text-xs text-zinc-400 leading-none">
                        {item.count} {item.count === 1 ? "lot" : "lots"}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Y-axis */}
                <div className="flex flex-col justify-between py-1 pb-10 text-left text-xs text-zinc-400 ml-4">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
              </div>
            )}
          </div>

          {lowest && highest && highest.label !== lowest.label && (
            <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8">
              <div className="inline-flex items-center gap-2 rounded-lg bg-[#E9F1ED] py-2 px-3">
                <Lightbulb className="size-4 text-emerald-600" />

                <span className="text-md font-semibold text-emerald-700">
                  Optimization Opportunity Identified
                </span>
              </div>

              <p className="mt-4 max-w-5xl text-sm  text-zinc-500">
                Switching from{" "}
                <span className="font-medium text-zinc-700">
                  {lowest.label}
                </span>{" "}
                to{" "}
                <span className="font-medium text-zinc-700">
                  {highest.label}
                </span>{" "}
                could improve average quality performance based on current
                historical inspection results. Consider reviewing sourcing
                strategies and intake allocation to reduce quality variance.
              </p>
            </div>
          )}
        </Card>

        {/* alerts */}
        <Card className="col-span-12 lg:col-span-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] font-semibold text-zinc-900">
              Operational Alerts
            </h2>
          </div>

          <div className="mt-4 h-[700px] flex flex-col">
            <AlertsPanel />
          </div>
        </Card>
      </div>
    </div>
  );
}
