"use client";

import { useMemo } from "react";
import { LotRow } from "./types";

type Props = {
  lots: LotRow[];
};

export default function StatusInfoPanel({ lots }: Props) {
  const stats = useMemo(() => {
    const totalWeight = lots.reduce((sum, l) => sum + Number(l.quantity_kg), 0);
    const scores = lots
      .flatMap((l) => l.qc_inspections.map((q) => q.ai_quality_score))
      .filter(Boolean);
    const avgScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    const highestScore = scores.length ? Math.max(...scores) : null;
    const lowestScore = scores.length ? Math.min(...scores) : null;
    const avgWeight = lots.length ? Math.round(totalWeight / lots.length) : 0;
    const materials = [...new Set(lots.map((l) => l.material_name))];
    const suppliers = [
      ...new Set(lots.map((l) => l.supplier?.name).filter(Boolean)),
    ];
    const earliestArrival = lots.length
      ? lots[lots.length - 1]?.arrival_date
      : null;
    const latestArrival = lots.length ? lots[0]?.arrival_date : null;

    const topMaterial = (() => {
      const counts = new Map<string, number>();
      lots.forEach((l) =>
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
      lots.forEach((l) => {
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

    return {
      totalWeight,
      avgScore,
      highestScore,
      lowestScore,
      avgWeight,
      materials,
      suppliers,
      earliestArrival,
      latestArrival,
      topMaterial,
      topSupplier,
    };
  }, [lots]);

  return (
    <section className="col-span-12 overflow-hidden rounded-[32px] border-1 border-[#0E8752]/20 bg-white lg:col-span-4 ">
      <div className="px-8 py-7">
        <h2 className="text-[24px] font-semibold leading-none text-zinc-900">
          Information
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-x-0 gap-y-6 px-8 pb-8">
        <div>
          <p className="text-sm text-zinc-500">Total Lots</p>
          <p className="mt-1 text-md font-bold text-zinc-900">{lots.length}</p>
        </div>
        <div>
          <p className="text-sm text-zinc-500">Total Weight</p>
          <p className="mt-1 text-md font-bold text-zinc-900">
            {stats.totalWeight.toLocaleString()} kg
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-500">Avg Weight</p>
          <p className="mt-1 text-md font-bold text-zinc-900">
            {stats.avgWeight} kg
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-500">Avg QC Score</p>
          <p className="mt-1 text-md font-bold text-zinc-900">
            {stats.avgScore || "—"}/100
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-500">Highest Score</p>
          <p className="mt-1 text-md font-bold text-zinc-900">
            {stats.highestScore ?? "—"}/100
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-500">Lowest Score</p>
          <p className="mt-1 text-md font-bold text-zinc-900">
            {stats.lowestScore ?? "—"}/100
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-500">Top Material</p>
          <p className="mt-1 text-md font-bold text-zinc-900">
            {stats.topMaterial}
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-500">Top Supplier</p>
          <p className="mt-1 text-md font-bold text-zinc-900">
            {stats.topSupplier}
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-500">Materials</p>
          <p className="mt-1 text-md font-bold text-zinc-900">
            {stats.materials.length}
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-500">Suppliers</p>
          <p className="mt-1 text-md font-bold text-zinc-900">
            {stats.suppliers.length}
          </p>
        </div>
        {/* <div><p className="text-sm text-zinc-500">Earliest Arrival</p><p className="mt-1 text-md font-bold text-zinc-900">{stats.earliestArrival ?? "—"}</p></div>
        <div><p className="text-sm text-zinc-500">Latest Arrival</p><p className="mt-1 text-md font-bold text-zinc-900">{stats.latestArrival ?? "—"}</p></div> */}
      </div>
    </section>
  );
}
