"use client";

import { useLotDetailQuery } from "../queries/lots-queries";
import QcDecisionForm from "@/features/qc/components/qc-decision-form";
import ZoneAssignment from "./zone-assignment";
import LotImageUpload from "./lot-image-upload";
import KnowledgeNoteForm from "@/features/knowledge/components/knowledge-note-form";
import KnowledgeNotesList from "@/features/knowledge/components/knowledge-notes-list";
import Link from "next/link";

export default function LotDetailPage({ lotId }: { lotId: string }) {
  const { data: lot, isLoading, error } = useLotDetailQuery(lotId);

  if (isLoading) {
    return <div className="text-zinc-400">Loading...</div>;
  }
  if (error || !lot) {
    return <div className="text-red-500">Lot not found.</div>;
  }

  const inspection = lot.qc_inspections?.[0];
  const scoreOffset = inspection
    ? 251.2 - (251.2 * inspection.ai_quality_score) / 100
    : 251.2;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
              Digital Batch Passport
            </span>
            {lot.status === "in_qc" && (
              <span className="rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                PENDING DECISION
              </span>
            )}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">{lot.lot_number}</h2>
          <p className="flex items-center gap-1 text-sm text-zinc-500">
            🌿 {lot.material_name} ({lot.material_type}) • Incoming Inspection
          </p>
        </div>
        {inspection && !inspection.human_decision && (
          <div className="flex gap-3">
            <QcDecisionForm lotId={lot.id} inspectionId={inspection.id} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left Column */}
        <div className="col-span-12 space-y-4 lg:col-span-8">
          {/* Lot Specifications */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-6">
            <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Lot Specifications
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-tight text-zinc-400">Supplier</p>
                <p className="font-mono text-sm font-medium text-zinc-800">{lot.supplier?.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-tight text-zinc-400">Weight</p>
                <p className="font-mono text-sm font-medium text-zinc-800">{lot.quantity_kg} kg</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-tight text-zinc-400">Receipt Date</p>
                <p className="font-mono text-sm font-medium text-zinc-800">{lot.arrival_date}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-tight text-zinc-400">Warehouse Zone</p>
                <p className="font-mono text-sm font-medium text-zinc-800">{lot.warehouse_zone ?? "Unassigned"}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-tight text-zinc-400">Status</p>
                <p className="font-mono text-sm font-medium text-zinc-800 capitalize">{lot.status.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-tight text-zinc-400">Created</p>
                <p className="font-mono text-sm font-medium text-zinc-800">{new Date(lot.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* AI QC Assessment */}
          {inspection && (
            <div className="grid grid-cols-2 gap-4">
              {/* Score Card */}
              <div className="flex items-center gap-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="transparent" stroke="#e4e4e7" strokeWidth="4" />
                    <circle
                      cx="48" cy="48" r="40" fill="transparent"
                      stroke="#059669" strokeWidth="4"
                      strokeDasharray="251.2"
                      strokeDashoffset={scoreOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-zinc-900">{inspection.ai_quality_score}</span>
                    <span className="text-[10px] text-zinc-400">/ 100</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-zinc-900">AI QC Score</h4>
                  <p className="text-sm text-zinc-500">
                    {inspection.ai_quality_score >= 75
                      ? <span>Exceeds threshold by <span className="font-bold text-emerald-600">+{inspection.ai_quality_score - 75}%</span></span>
                      : <span className="text-red-600">Below threshold</span>}
                  </p>
                </div>
              </div>

              {/* Assessment Details */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  ✨ Intelligence Assessment
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">Color Profile</span>
                    <span className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-700">
                      {inspection.ai_colour ?? "Standard"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">Foreign Matter</span>
                    <span className={`text-xs font-bold ${inspection.ai_foreign_matter ? "text-red-600" : "text-emerald-600"}`}>
                      {inspection.ai_foreign_matter ? "Detected" : "None"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-zinc-500">Defects</span>
                    <span className="text-right text-xs font-medium text-zinc-600">
                      {Array.isArray(inspection.ai_defects) && inspection.ai_defects.length > 0
                        ? (inspection.ai_defects as string[]).join(", ")
                        : "None detected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Recommendation */}
          {inspection?.ai_recommendation && (
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400">AI Recommendation</h3>
              <p className="text-sm text-zinc-700">{inspection.ai_recommendation}</p>
              {inspection.ai_notes && (
                <p className="mt-2 text-sm italic text-zinc-500">{inspection.ai_notes}</p>
              )}
            </div>
          )}

          {/* Human Decision */}
          {inspection?.human_decision && (
            <div className={`rounded-xl border p-5 ${inspection.human_decision === "approved" ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
              <h3 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400">Human Decision</h3>
              <p className={`text-sm font-bold ${inspection.human_decision === "approved" ? "text-emerald-700" : "text-red-700"}`}>
                {inspection.human_decision.toUpperCase()}
              </p>
              {inspection.human_notes && <p className="mt-1 text-sm text-zinc-600">{inspection.human_notes}</p>}
            </div>
          )}

          {/* Images */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Inspection Images</h3>
            {lot.lot_images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {lot.lot_images.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={img.id} src={img.storage_url} alt="Lot" className="h-40 w-full rounded-lg object-cover" />
                ))}
              </div>
            )}
            <LotImageUpload lotId={lot.id} />
          </div>

          {/* Zone Assignment */}
          {lot.status === "approved" && !lot.warehouse_zone && (
            <ZoneAssignment lotId={lot.id} />
          )}

          {/* Knowledge Notes */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Knowledge Notes</h3>
            <KnowledgeNotesList lotId={lot.id} />
            <KnowledgeNoteForm lotId={lot.id} materialName={lot.material_name} />
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-24 rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="mb-6 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Genealogy & Events
            </h3>

            {lot.batch_events.length === 0 ? (
              <p className="text-sm text-zinc-400">No events recorded.</p>
            ) : (
              <div className="relative ml-2 space-y-8 border-l border-emerald-200 pl-6">
                {lot.batch_events.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-[29px] top-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 ring-4 ring-emerald-50" />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                      {new Date(event.created_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <h4 className="text-sm font-semibold text-zinc-800">{event.event_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</h4>
                    <p className="text-xs text-zinc-500">{event.description}</p>
                    {event.actor_name && (
                      <p className="mt-1 text-[10px] text-zinc-400">by {event.actor_name}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Chain of Custody */}
            <div className="mt-8 border-t border-zinc-100 pt-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-zinc-400">Chain of Custody</span>
                <span className="text-emerald-500">✓</span>
              </div>
              <div className="flex -space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-zinc-100 text-[10px] font-bold text-zinc-600">OP</div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-[10px] font-bold text-emerald-700">AI</div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-[10px] font-bold text-blue-700">QC</div>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-6 border-t border-zinc-100 pt-4">
              <Link href="/dashboard" className="text-sm font-medium text-emerald-600 hover:text-emerald-800">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
