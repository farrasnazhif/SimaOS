"use client";

import PageHeader from "@/components/ui/page-header";
import Card from "@/components/ui/card";
import AlertsPanel from "@/features/alerts/components/alerts-panel";
import DashboardKpiCards from "@/features/dashboard/components/dashboard-kpi-cards";
import QualityTrendsChart from "@/features/dashboard/components/quality-trends-chart";

export default function DashboardView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Track inventory status, quality trends, and critical operational alerts."
      />

      <DashboardKpiCards />

      <div className="grid grid-cols-12 gap-6">
        <QualityTrendsChart />

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
