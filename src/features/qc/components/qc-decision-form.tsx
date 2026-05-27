"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { toast } from "sonner";
import Button from "@/components/ui/buttons/button";

export default function QcDecisionForm({ lotId, inspectionId }: { lotId: string; inspectionId: string }) {
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (decision: "approved" | "rejected") => {
      const supabase = getSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error: qcError } = await (supabase
        .from("qc_inspections") as any)
        .update({ human_decision: decision, human_notes: notes || null })
        .eq("id", inspectionId);
      if (qcError) throw qcError;

      const newStatus = decision === "approved" ? "approved" : "rejected";
      const { error: lotError } = await (supabase
        .from("lots") as any)
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", lotId);
      if (lotError) throw lotError;

      const { error: eventError } = await (supabase.from("batch_events") as any).insert({
        lot_id: lotId,
        event_type: `human_${decision}`,
        description: `Lot ${decision} by operator.${notes ? ` Notes: ${notes}` : ""}`,
        actor_id: userData.user.id,
        actor_name: userData.user.email ?? "Operator",
      });
      if (eventError) throw eventError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lots", "detail", lotId] });
      queryClient.invalidateQueries({ queryKey: ["lots", "list"] });
    },
  });

  function handleDecision(decision: "approved" | "rejected") {
    toast.promise(mutation.mutateAsync(decision), {
      loading: "Submitting decision...",
      success: `Lot ${decision}.`,
      error: "Failed to submit decision.",
    });
  }

  return (
    <div className="space-y-3 rounded border border-zinc-700/50 bg-zinc-800/50 p-4">
      <p className="text-xs font-bold uppercase text-zinc-500">Human Review Required</p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional notes..."
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
        rows={2}
      />
      <div className="flex gap-3">
        <Button variant="primary" size="sm" onClick={() => handleDecision("approved")} isLoading={mutation.isPending}>
          Approve
        </Button>
        <Button variant="secondary" size="sm" onClick={() => handleDecision("rejected")} isLoading={mutation.isPending}>
          Reject
        </Button>
      </div>
    </div>
  );
}
