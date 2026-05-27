"use client";

import { useLotDetailQuery } from "../queries/lots-queries";
import QcDecisionForm from "@/features/qc/components/qc-decision-form";
import ZoneAssignment from "./zone-assignment";
import LotImageUpload from "./lot-image-upload";
import KnowledgeNoteForm from "@/features/knowledge/components/knowledge-note-form";
import KnowledgeNotesList from "@/features/knowledge/components/knowledge-notes-list";
import Link from "next/link";

const statusColors: Record<string, string> = {
  approved: "bg-green-50 text-green-700 border-green-200",
  in_qc: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  in_production: "bg-emerald-50 text-emerald-700 border-emerald-200",
  arriving: "bg-zinc-50 text-zinc-600 border-zinc-200",
};

export default function LotDetailPage({ lotId }: { lotId: string }) {
  const { data: lot, isLoading, error } = useLotDetailQuery(lotId);

  if (isLoading) {
    return <div className="text-zinc-400">Loading...</div>;
  }
  if (error || !lot) {
    return <div className="text-red-500">Lot not found.</div>;
  }

  const inspection = lot.qc_inspections?.[0];
  const statusColor = statusColors[lot.status] ?? statusColors.arriving;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-zinc-500">
          <Link href="/dashboard" className="hover:text-emerald-700">Dashboard</Link>
          <span className="mx-2">›</span>
          <span className="text-zinc-800 font-medium">{lot.lot_number}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">{lot.lot_number}</h1>
            <p className="text-sm text-zinc-500">{lot.material_name} — {lot.supplier?.name ?? "Unknown"}</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusColor}`}>
            {lot.status.replace("_", " ")}
          </span>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-zinc-200 bg-white p-5 sm:grid-cols-4">
          <div>
            <p className="text-[11px] font-bold uppercase text-zinc-400">Material</p>
            <p className="text-sm text-zinc-800">{lot.material_type}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-zinc-400">Quantity</p>
            <p className="text-sm text-zinc-800">{lot.quantity_kg} kg</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-zinc-400">Arrival</p>
            <p className="text-sm text-zinc-800">{lot.arrival_date}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-zinc-400">Zone</p>
            <p className="text-sm text-zinc-800">{lot.warehouse_zone ?? "Unassigned"}</p>
          </div>
        </div>

        {/* QC Inspection */}
        {inspection && (
          <section className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">AI QC Inspection</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-bold uppercase text-zinc-400">Quality Score</p>
                <p className="text-2xl font-bold text-emerald-700">{inspection.ai_quality_score}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-zinc-400">Colour</p>
                <p className="text-sm text-zinc-700">{inspection.ai_colour ?? "—"}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-zinc-400">Foreign Matter</p>
                <p className="text-sm text-zinc-700">{inspection.ai_foreign_matter ? "Detected" : "None"}</p>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <p className="text-[11px] font-bold uppercase text-zinc-400">Recommendation</p>
                <p className="text-sm text-zinc-700">{inspection.ai_recommendation ?? "—"}</p>
              </div>
            </div>

            {inspection.human_decision ? (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-[11px] font-bold uppercase text-zinc-400">Human Decision</p>
                <p className={`text-sm font-semibold ${inspection.human_decision === "approved" ? "text-green-700" : "text-red-600"}`}>
                  {inspection.human_decision.toUpperCase()}
                </p>
                {inspection.human_notes && <p className="mt-1 text-sm text-zinc-600">{inspection.human_notes}</p>}
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

        {/* Images */}
        <section className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900">Inspection Images</h2>
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
        <section className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900">Knowledge Notes</h2>
          <KnowledgeNotesList lotId={lot.id} />
          <KnowledgeNoteForm lotId={lot.id} materialName={lot.material_name} />
        </section>

        {/* Timeline */}
        <section className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900">Batch Passport Timeline</h2>
          {lot.batch_events.length === 0 ? (
            <p className="text-sm text-zinc-400">No events recorded.</p>
          ) : (
            <div className="space-y-3">
              {lot.batch_events.map((event) => (
                <div key={event.id} className="flex gap-3 border-l-2 border-emerald-200 pl-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-800">{event.description ?? event.event_type}</p>
                    <p className="text-xs text-zinc-400">{event.actor_name} · {new Date(event.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
  );
}
