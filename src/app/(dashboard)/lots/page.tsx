"use client";

import IncomingLotsTable from "@/features/lots/components/incoming-lots-table";
import LotsKpiCards from "@/features/lots/components/lots-kpi-cards";

export default function LotsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-semibold text-zinc-900">Inventory</h1>
        <p className="mt-1 text-base text-zinc-700">
          Manage incoming materials and Lots.
        </p>
      </div>

      <LotsKpiCards />

      <IncomingLotsTable />
    </div>
  );
}
