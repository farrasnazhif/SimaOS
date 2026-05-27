"use client";

import IncomingLotsTable from "@/features/lots/components/incoming-lots-table";
import KpiCards from "@/features/dashboard/components/kpi-cards";
import AlertsPanel from "@/features/alerts/components/alerts-panel";
import SupplierAnalytics from "@/features/analytics/components/supplier-analytics";
import CopilotPanel from "@/features/copilot/components/copilot-panel";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Dashboard</h1>
          <p className="text-sm text-zinc-400">SimaOS Manufacturing Intelligence</p>
        </div>

        <KpiCards />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <IncomingLotsTable />
            <section>
              <h2 className="mb-3 text-lg font-semibold text-zinc-100">Supplier Analytics</h2>
              <SupplierAnalytics />
            </section>
          </div>
          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-lg font-semibold text-zinc-100">Active Alerts</h2>
              <AlertsPanel />
            </section>
            <section>
              <h2 className="mb-3 text-lg font-semibold text-zinc-100">Manufacturing Copilot</h2>
              <CopilotPanel />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
