"use client";

import Button from "@/components/ui/buttons/button";
import IncomingLotsTable from "@/features/lots/components/incoming-lots-table";
import LotsKpiCards from "@/features/lots/components/lots-kpi-cards";
import { ArchiveRestore } from "lucide-react";
import Link from "next/link";

export default function LotsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-zinc-900">Inventory</h1>

          <p className="mt-1 text-base text-zinc-700">
            Manage incoming materials and Lots.
          </p>
        </div>

        <Link href="/batches/new">
          <Button leftIcon={ArchiveRestore}>Create Batch</Button>
        </Link>
      </div>

      <LotsKpiCards />

      <IncomingLotsTable />
    </div>
  );
}
