"use client";

import IncomingLotsTable from "@/features/lots/components/incoming-lots-table";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">
            Incoming Lots
          </h1>
          <p className="text-sm text-zinc-400">
            Manage incoming material lots, quality certifications, and batch
            initialization.
          </p>
        </div>

        <IncomingLotsTable />
      </div>
    </main>
  );
}
