"use client";

import { useMemo, useState } from "react";
import { ListFilter } from "lucide-react";
import Button from "@/components/ui/buttons/button";
import { LotRow } from "./types";

type ChartGroupBy = "material" | "supplier";

type Props = {
  lots: LotRow[];
};

export default function StatusQualityChart({ lots }: Props) {
  const [chartGroupBy, setChartGroupBy] = useState<ChartGroupBy>("material");
  const [chartFilterOpen, setChartFilterOpen] = useState(false);

  const chartData = useMemo(() => {
    if (!lots.length) return [];
    const grouped = new Map<string, { totalScore: number; count: number }>();
    for (const lot of lots) {
      const score = lot.qc_inspections?.[0]?.ai_quality_score;
      if (score == null) continue;

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
  }, [lots, chartGroupBy]);

  // const lowest =
  //   chartData.length > 1
  //     ? chartData.reduce((a, b) => (a.avgScore < b.avgScore ? a : b))
  //     : null;
  // const highest =
  //   chartData.length > 1
  //     ? chartData.reduce((a, b) => (a.avgScore > b.avgScore ? a : b))
  //     : null;

  return (
    <section className="col-span-12 overflow-hidden rounded-[32px] border-1 border-[#0E8752]/20 bg-white lg:col-span-8 ">
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
                    onClick={() => setChartGroupBy(o.value)}
                    className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${chartGroupBy === o.value ? "bg-emerald-50 font-semibold text-emerald-700" : "text-zinc-600 hover:bg-zinc-50"}`}
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
        <div className="rounded-[18px] border-1 border-[#0E8752]/20 bg-zinc-50 p-6">
          {chartData.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center text-zinc-400">
              No data available.
            </div>
          ) : (
            <div className="flex gap-2" style={{ height: 280 }}>
              <div className="relative flex flex-1 items-end gap-4">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-zinc-200/60" />
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
                        className={`relative w-full min-h-[8px] rounded-t-2xl transition-all group-hover:opacity-80 ${
                          item.avgScore < 50
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
                    <p className="text-center text-xs font-medium text-zinc-700">
                      {item.label}
                    </p>
                    <p className="text-xs text-zinc-400 leading-none">
                      {item.count} {item.count === 1 ? "lot" : "lots"}
                    </p>
                  </div>
                ))}
              </div>
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
      </div>

      {/* {lowest && highest && highest.label !== lowest.label && (
        <div className="mx-6 mb-6 rounded-lg border border-zinc-200 bg-white p-8">
          <div className="inline-flex items-center gap-3 rounded-lg bg-[#E9F1ED] p-2">
            <Lightbulb className="size-4 text-emerald-600" />
            <span className="text-md font-semibold text-emerald-700">Optimization Opportunity Identified</span>
          </div>
          <p className="mt-4 max-w-5xl text-sm text-zinc-500">
            Switching from <span className="font-medium text-zinc-700">{lowest.label}</span> to{" "}
            <span className="font-medium text-zinc-700">{highest.label}</span> could improve average quality
            performance based on current historical inspection results. Consider reviewing sourcing strategies
            and intake allocation to reduce quality variance.
          </p>
        </div>
      )} */}
    </section>
  );
}
