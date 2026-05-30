"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLotDetailQuery } from "../queries/lots-queries";
import { useLotDecisionMutation } from "../queries/lots-queries";
import { useDeleteLotMutation } from "../queries/lots-queries";
import {
  ChevronDown,
  ChevronUp,
  CircleCheckBig,
  CircleX,
  ClockFading,
  Eye,
  Layers3,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import Breadcrumb from "@/components/ui/breadcrumb";
import Skeleton from "@/components/ui/skeleton";
import Button from "@/components/ui/buttons/button";
import IconButton from "@/components/ui/buttons/icon-button";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    in_qc: { bg: "bg-amber-100", text: "text-amber-600", label: "Awaiting QC" },
    approved: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      label: "Approved",
    },
    rejected: { bg: "bg-red-100", text: "text-red-600", label: "Rejected" },
    in_production: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      label: "In Production",
    },
    arriving: { bg: "bg-zinc-100", text: "text-zinc-600", label: "Arriving" },
  };
  const s = map[status] ?? {
    bg: "bg-zinc-100",
    text: "text-zinc-600",
    label: status,
  };
  return (
    <div
      className={`mt-2 inline-flex rounded-xl px-4 py-1.5 text-sm font-semibold ${s.bg} ${s.text}`}
    >
      {s.label}
    </div>
  );
}

function TimelineSection({
  events,
}: {
  events: {
    id: string;
    event_type: string;
    description: string | null;
    actor_name: string | null;
    created_at: string;
  }[];
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? events : events.slice(0, 7);

  return (
    <section className="rounded-[28px] border-2 border-[#0E8752]/20 bg-white p-8">
      <h2 className="text-[20px] font-semibold text-zinc-900">Story</h2>

      <div className="mt-8 space-y-10">
        {events.length === 0 ? (
          <p className="text-sm text-zinc-400">No events recorded.</p>
        ) : (
          visible.map((event, idx) => (
            <div key={event.id} className="relative pl-14">
              {idx !== visible.length - 1 && (
                <div className="absolute left-[14px] top-8 h-[120px] w-[2px] bg-emerald-200" />
              )}

              <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-emerald-100 bg-white">
                <div className="h-4 w-4 rounded-full bg-emerald-600" />
              </div>

              <p className="text-sm font-medium text-emerald-600">
                {new Date(event.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                {new Date(event.created_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <h3 className="mt-1 text-lg font-semibold text-zinc-900">
                {event.event_type
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </h3>

              <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-zinc-500">
                {event.description ?? "—"}
              </p>

              {event.actor_name && (
                <p className="mt-1 text-xs text-zinc-400">
                  by {event.actor_name}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {events.length > 7 && (
        <Button
          onClick={() => setExpanded(!expanded)}
          className="mt-6 w-full"
          rightIcon={expanded ? ChevronUp : ChevronDown}
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      )}
    </section>
  );
}

function LotActions({
  lotId,
  status,
  inspectionId,
}: {
  lotId: string;
  status: string;
  inspectionId?: string;
}) {
  const mutation = useLotDecisionMutation();
  const deleteMutation = useDeleteLotMutation();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleAction(decision: "approved" | "rejected" | "revoked") {
    toast.promise(
      mutation.mutateAsync({ lotId, inspectionId: inspectionId!, decision }),
      {
        loading: "Processing...",
        success:
          decision === "revoked" ? "Approval revoked." : `Lot ${decision}.`,
        error: "Action failed.",
      },
    );
  }

  function handleDelete() {
    setShowDeleteConfirm(false);
    toast.promise(
      deleteMutation.mutateAsync(lotId).then(() => router.push("/lots")),
      {
        loading: "Deleting lot...",
        success: "Lot deleted.",
        error: "Failed to delete.",
      },
    );
  }

  const deleteModal = showDeleteConfirm && (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={() => setShowDeleteConfirm(false)}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-zinc-900">Delete Lot</h3>
        <p className="mt-2 text-sm text-zinc-500">
          Are you sure you want to delete this lot? This action cannot be
          undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            leftIcon={Trash2}
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );

  if (!inspectionId)
    return (
      <>
        {deleteModal}
        <IconButton
          icon={Trash2}
          variant="destructive"
          onClick={() => setShowDeleteConfirm(true)}
          isLoading={deleteMutation.isPending}
        />
      </>
    );

  const hasDecision = status === "approved" || status === "rejected";

  if (hasDecision) {
    return (
      <>
        {deleteModal}
        <div className="flex gap-3">
          <Button
            onClick={() => handleAction("revoked")}
            isLoading={mutation.isPending}
            leftIcon={ClockFading}
            className="bg-[#F88D00] text-white hover:bg-[#E07F00] disabled:bg-[#F6B85C] disabled:text-white/80 disabled:cursor-not-allowed"
          >
            {status === "approved" ? "Revoke Approval" : "Revoke Rejection"}
          </Button>
          <IconButton
            icon={Trash2}
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            isLoading={deleteMutation.isPending}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {deleteModal}
      <div className="flex gap-3">
        <Button
          variant="destructive"
          onClick={() => handleAction("rejected")}
          isLoading={mutation.isPending}
          leftIcon={CircleX}
        >
          Reject Batch
        </Button>
        <Button
          onClick={() => handleAction("approved")}
          isLoading={mutation.isPending}
          leftIcon={CircleCheckBig}
        >
          Approve Batch
        </Button>
        <IconButton
          icon={Trash2}
          variant="destructive"
          onClick={() => setShowDeleteConfirm(true)}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </>
  );
}

export default function LotDetailPage({ lotId }: { lotId: string }) {
  const { data: lot, isLoading, error } = useLotDetailQuery(lotId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }
  if (error || !lot) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        Lot not found.
      </div>
    );
  }

  const inspection = lot.qc_inspections?.[0];
  const score = inspection?.ai_quality_score ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-5">
        <div>
          <Breadcrumb lastLabel={lot.lot_number} />

          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                {lot.lot_number}
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                {lot.material_name} ({lot.material_type})
              </p>
            </div>

            <LotActions
              lotId={lot.id}
              status={lot.status}
              inspectionId={inspection?.id}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left section */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {/* Lot Specification */}
          <section className="rounded-[28px] border-2 border-[#0E8752]/20 bg-white p-8">
            <h2 className="text-[20px] font-semibold text-zinc-900">
              Lot Specification
            </h2>

            <div className="mt-8 grid grid-cols-3 gap-y-10">
              <div>
                <p className="text-sm text-zinc-500">Supplier</p>
                <h3 className="mt-1 text-md font-semibold text-zinc-900">
                  {lot.supplier?.name ?? "—"}
                </h3>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Weight</p>
                <h3 className="mt-1 text-md font-semibold text-zinc-900">
                  {lot.quantity_kg} kg
                </h3>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Status</p>
                <StatusBadge status={lot.status} />
              </div>

              <div>
                <p className="text-sm text-zinc-500">Arrival Date</p>
                <h3 className="mt-1 text-md font-semibold text-zinc-900">
                  {new Date(lot.arrival_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Warehouse Zone</p>
                <h3 className="mt-1 text-md font-semibold text-zinc-900">
                  {lot.warehouse_zone ?? "Unassigned"}
                </h3>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Material Type</p>
                <h3 className="mt-1 text-md font-semibold text-zinc-900">
                  {lot.material_type}
                </h3>
              </div>
            </div>
          </section>

          {/* QC Score */}
          {inspection && (
            <section className="rounded-[28px] border-2 border-[#0E8752]/20 bg-white p-8">
              <h2 className="text-[20px] font-semibold text-zinc-900">
                QC Score
              </h2>

              <div className="mt-8 flex gap-12">
                {/* Circle score */}
                <div className="relative flex h-[150px] w-[150px] items-center justify-center">
                  <svg
                    className="absolute inset-0 h-full w-full -rotate-90"
                    viewBox="0 0 150 150"
                  >
                    <circle
                      cx="75"
                      cy="75"
                      r="63"
                      fill="transparent"
                      stroke="#d1fae5"
                      strokeWidth="12"
                    />
                    <circle
                      cx="75"
                      cy="75"
                      r="63"
                      fill="transparent"
                      stroke="#059669"
                      strokeWidth="12"
                      strokeDasharray={`${2 * Math.PI * 63}`}
                      strokeDashoffset={`${2 * Math.PI * 63 * (1 - score / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-[56px] font-bold leading-none tracking-tight text-[#0E8752]">
                      {score}
                    </h3>

                    <p className="-mt-1 text-[18px] font-medium text-zinc-700">
                      /100
                    </p>
                  </div>
                </div>

                {/* QC Details */}
                <div className="grid flex-1 grid-cols-2 gap-y-10">
                  <div className="max-w-[200px]">
                    <p className="text-sm text-zinc-500">Color Profile</p>
                    <h3 className="mt-1 text-sm font-semibold text-zinc-900">
                      {inspection.ai_colour ?? "Standard"}
                    </h3>
                  </div>

                  <div className="max-w-[200px]">
                    <p className="text-sm text-zinc-500">Foreign Matter</p>
                    <h3
                      className={`mt-1 text-sm font-semibold ${inspection.ai_foreign_matter ? "text-red-600" : "text-emerald-600"}`}
                    >
                      {inspection.ai_foreign_matter ? "Detected" : "None"}
                    </h3>
                  </div>

                  <div className="max-w-[200px]">
                    <p className="text-sm text-zinc-500">Defects</p>
                    <h3 className="mt-1 text-sm font-semibold text-zinc-900">
                      {Array.isArray(inspection.ai_defects) &&
                      inspection.ai_defects.length > 0
                        ? (inspection.ai_defects as string[]).join(", ")
                        : "None detected"}
                    </h3>
                  </div>

                  {inspection.ai_recommendation && (
                    <div className="max-w-[200px]">
                      <p className="text-sm text-zinc-500">Recommendation</p>
                      <h3 className="mt-1 text-sm font-semibold text-zinc-900">
                        {inspection.ai_recommendation}
                      </h3>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Vision Image Card */}
              {
                <div className="mt-8 overflow-hidden rounded-[24px] border-2 border-[#0E8752]/20 bg-gray-50">
                  {/* Top bar */}
                  <div className="flex items-center justify-between  border-zinc-100 px-5 py-4 ">
                    <div className="flex items-center gap-3">
                      <Eye className="size-5 text-emerald-600" />
                      <h3 className="font-semibold text-zinc-800">
                        AI Computer Vision Overview
                      </h3>
                    </div>
                    <Layers3 className="size-5 text-emerald-600" />
                  </div>

                  {/* Image with bounding boxes */}
                  <div className="overflow-hidden rounded-[28px] border-t-2 border-[#0E8752]/20  bg-white">
                    {/* image wrapper */}
                    <div className="p-3">
                      <div className="relative overflow-hidden rounded-[24px] border border-[#0E8752]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            lot.lot_images[0]?.storage_url ?? "/turmeric.jpg"
                          }
                          alt={lot.material_name}
                          className="h-[360px] w-full object-cover"
                        />

                        {/* Dynamic bounding boxes from AI detections */}

                        {inspection.ai_detections?.map((det, idx) => (
                          <div
                            key={idx}
                            className="absolute rounded-[24px] border-4 border-dashed border-white"
                            style={{
                              left: `${det.x}%`,

                              top: `${det.y}%`,

                              width: `${det.width}%`,

                              height: `${det.height}%`,
                            }}
                          >
                            <div className="absolute -right-4 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
                              <Eye className="size-5 text-emerald-600" />
                            </div>

                            <span className="absolute -bottom-6 left-0 rounded bg-white/90 px-2 py-0.5 text-xs font-medium text-zinc-700 shadow">
                              {det.label}
                            </span>
                          </div>
                        ))}

                        {/* Fallback static boxes when no detections */}

                        {(!inspection.ai_detections ||
                          inspection.ai_detections.length === 0) && (
                          <>
                            <div className="absolute left-14 top-16 h-[190px] w-[240px] rounded-[24px] border-4 border-dashed border-white">
                              <div className="absolute -right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
                                <Eye className="size-5 text-emerald-600" />
                              </div>
                            </div>

                            <div className="absolute bottom-10 right-12 h-[120px] w-[170px] rounded-[24px] border-4 border-dashed border-white">
                              <div className="absolute -right-4 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
                                <Eye className="size-5 text-emerald-600" />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              }
            </section>
          )}
        </div>

        {/* Timeline (right column) */}
        <div className="col-span-12 lg:col-span-4">
          <TimelineSection events={lot.batch_events} />
        </div>
      </div>
    </div>
  );
}
