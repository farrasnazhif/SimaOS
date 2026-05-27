"use client";

import { useState } from "react";
import { useAssignZoneMutation } from "../queries/lots-queries";
import { toast } from "sonner";
import Button from "@/components/ui/buttons/button";

const zones = [
  { value: "Zone A — Dry Storage", label: "Zone A — Dry Storage" },
  { value: "Zone B — Cold Storage", label: "Zone B — Cold Storage" },
  { value: "Zone C — Quarantine", label: "Zone C — Quarantine" },
  { value: "Zone D — Processing Queue", label: "Zone D — Processing Queue" },
];

export default function ZoneAssignment({ lotId }: { lotId: string }) {
  const [zone, setZone] = useState("");
  const mutation = useAssignZoneMutation();

  function handleAssign() {
    if (!zone) return;
    toast.promise(mutation.mutateAsync({ lotId, zone }), {
      loading: "Assigning zone...", success: "Zone assigned.", error: "Failed to assign zone.",
    });
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3">
      <h2 className="text-lg font-semibold text-zinc-900">Assign Warehouse Zone</h2>
      <select
        value={zone}
        onChange={(e) => setZone(e.target.value)}
        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 focus:border-emerald-400 focus:outline-none"
      >
        <option value="">Select zone...</option>
        {zones.map((z) => (
          <option key={z.value} value={z.value}>{z.label}</option>
        ))}
      </select>
      <Button variant="primary" size="sm" onClick={handleAssign} isLoading={mutation.isPending}>
        Assign Zone
      </Button>
    </div>
  );
}
