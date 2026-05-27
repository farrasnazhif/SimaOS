"use client";

import { useLotDetailQuery } from "../queries/lots-queries";
import QcDecisionForm from "@/features/qc/components/qc-decision-form";
import ZoneAssignment from "./zone-assignment";
import LotImageUpload from "./lot-image-upload";
import KnowledgeNoteForm from "@/features/knowledge/components/knowledge-note-form";
import KnowledgeNotesList from "@/features/knowledge/components/knowledge-notes-list";
import Link from "next/link";

const statusColors: Record<string, string> = {
  approved: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  in_qc: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  in_production: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  arriving: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function LotDetailPage({ lotId }: { lotId: string }) {
  const { data: lot, isLoading, error } = useLotDetailQuery(lotId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-8">
        <div className="mx-auto max-w-5xl text-zinc-400">Loading...</div>
      </main>
    );
  }

  if (error || !lot) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-8">
        <div className="mx-auto max-w-5xl text-red-400">Lot not found.</div>
      </main>
    );
  }

  const inspection = lot.qc_inspections?.[0];
  const statusColor = statusColors[lot.status] ?? statusColors.arriving;

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-zinc-400">
          <Link href="/dashboard" className="hover:text-zinc-200">Dashboard</Link>
          <span className="mx-2">›</span>
          <span className="text-zinc-200">{lot.lot_number}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">{lot.lot_number}</h1>
            <p className="text-sm text-zinc-400">{lot.material_name} — {lot.supplier?.name ?? "Unknown supplier"}</p>
          </div>
          <span className={`rounded border px-3 py-1 text-xs font-bold uppercase ${statusColor}`}>
            {lot.status.replace("_", " ")}
          </span>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 rounded-lg border border-zinc-700/50 bg-zinc-900 p-5 sm:grid-cols-4">
          <div>
            <p className="text-[11px] font-bold uppercase text-zinc-500">Material</p>
            <p className="text-sm text-zinc-200">{lot.material_type}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-zinc-500">Quantity</p>
            <p className="text-sm text-zinc-200">{lot.quantity_kg} kg</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-zinc-500">Arrival</p>
            <p className="text-sm text-zinc-200">{lot.arrival_date}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-zinc-500">Zone</p>
            <p className="text-sm text-zinc-200">{lot.warehouse_zone ?? "Unassigned"}</p>
          </div>
        </div>

        {/* QC Inspection */}
        {inspection && (
          <section className="rounded-lg border border-zinc-700/50 bg-zinc-900 p-5 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-100">AI QC Inspection</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-bold uppercase text-zinc-500">Quality Score</p>
                <p className="text-2xl font-bold text-blue-400">{inspection.ai_quality_score}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-zinc-500">Colour</p>
                <p className="text-sm text-zinc-200">{inspection.ai_colour ?? "—"}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-zinc-500">Foreign Matter</p>
                <p className="text-sm text-zinc-200">{inspection.ai_foreign_matter ? "Detected" : "None"}</p>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <p className="text-[11px] font-bold uppercase text-zinc-500">Recommendation</p>
                <p className="text-sm text-zinc-200">{inspection.ai_recommendation ?? "—"}</p>
              </div>
              {inspection.ai_notes && (
                <div className="col-span-2 sm:col-span-3">
                  <p className="text-[11px] font-bold uppercase text-zinc-500">Notes</p>
                  <p className="text-sm text-zinc-300">{inspection.ai_notes}</p>
                </div>
              )}
            </div>

            {/* Human Decision */}
            {inspection.human_decision ? (
              <div className="rounded border border-zinc-700/50 bg-zinc-800/50 p-4">
                <p className="text-[11px] font-bold uppercase text-zinc-500">Human Decision</p>
                <p className={`text-sm font-semibold ${inspection.human_decision === "approved" ? "text-blue-400" : "text-red-400"}`}>
                  {inspection.human_decision.toUpperCase()}
                </p>
                {inspection.human_notes && <p className="mt-1 text-sm text-zinc-300">{inspection.human_notes}</p>}
              </div>
            ) : (
              <QcDecisionForm lotId={lot.id} inspectionId={inspection.id} />
            )}
          </section>
        )}

        {/* Zone Assignment */}
        {lot.status === "approved" && !lot.warehouse_zone && (
          <ZoneAssignment lotId={lot.id} />
        )}

        {/* Image Upload */}
        <section className="rounded-lg border border-zinc-700/50 bg-zinc-900 p-5 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100">Inspection Images</h2>
          {lot.lot_images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {lot.lot_images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={img.id} src={img.storage_url} alt="Lot inspection" className="h-32 w-full rounded-lg object-cover" />
              ))}
            </div>
          )}
          <LotImageUpload lotId={lot.id} />
        </section>

        {/* Knowledge Notes */}
        <section className="rounded-lg border border-zinc-700/50 bg-zinc-900 p-5 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100">Knowledge Notes</h2>
          <KnowledgeNotesList lotId={lot.id} />
          <KnowledgeNoteForm lotId={lot.id} materialName={lot.material_name} />
        </section>

        {/* Batch Event Timeline */}
        <section className="rounded-lg border border-zinc-700/50 bg-zinc-900 p-5 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100">Batch Passport Timeline</h2>
          {lot.batch_events.length === 0 ? (
            <p className="text-sm text-zinc-400">No events recorded.</p>
          ) : (
            <div className="space-y-3">
              {lot.batch_events.map((event) => (
                <div key={event.id} className="flex gap-3 border-l-2 border-zinc-700 pl-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-200">{event.description ?? event.event_type}</p>
                    <p className="text-xs text-zinc-500">{event.actor_name} · {new Date(event.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
