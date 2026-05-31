"use client";

import Button from "@/components/ui/buttons/button";
import PageHeader from "@/components/ui/page-header";
import IncomingLotsTable from "@/features/lots/components/incoming-lots-table";
import LotKpiCards from "@/features/lots/components/lot-kpi-cards";
import { ArchiveRestore } from "lucide-react";
import Link from "next/link";

export default function LotsView() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Inventory"
        description="Manage incoming materials and Lots."
        actions={
          <Link href="/batches/new">
            <Button leftIcon={ArchiveRestore}>Create Batch</Button>
          </Link>
        }
      />

      <LotKpiCards />

      <IncomingLotsTable />
    </div>
  );
}
