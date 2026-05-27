"use client";

import AppShell from "@/components/ui/app-shell";
import IncomingLotsTable from "@/features/lots/components/incoming-lots-table";
import KpiCards from "@/features/dashboard/components/kpi-cards";
import AlertsPanel from "@/features/alerts/components/alerts-panel";
import SupplierAnalytics from "@/features/analytics/components/supplier-analytics";
import CopilotPanel from "@/features/copilot/components/copilot-panel";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
          <p className="text-sm text-zinc-500">SimaOS Manufacturing Intelligence</p>
        </div>

        <KpiCards />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <IncomingLotsTable />
            <section>
              <h2 className="mb-3 text-lg font-semibold text-zinc-900">Supplier Analytics</h2>
              <SupplierAnalytics />
            </section>
          </div>
          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-lg font-semibold text-zinc-900">Active Alerts</h2>
              <AlertsPanel />
            </section>
            <section>
              <h2 className="mb-3 text-lg font-semibold text-zinc-900">Manufacturing Copilot</h2>
              <CopilotPanel />
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
