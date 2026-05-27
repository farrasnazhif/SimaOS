"use client";

import Link from "next/link";
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
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <nav className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              <span>Inventory</span>
              <span className="text-zinc-300">›</span>
              <span className="text-emerald-600">Raw Materials</span>
            </nav>
            <h1 className="text-2xl font-semibold text-zinc-900">Incoming Lots</h1>
            <p className="max-w-lg text-sm text-zinc-500">
              Manage incoming material lots, quality certifications, and batch initialization for production lines.
            </p>
          </div>
          <Link
            href="/batches/new"
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all"
          >
            + CREATE BATCH
          </Link>
        </div>

        {/* KPI Grid */}
        <KpiCards />

        {/* Main content grid */}
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
