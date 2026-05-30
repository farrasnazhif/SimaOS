"use client";

import { useMutation } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { gradeQcAction } from "../actions/grade-qc-action";
import {
  CreateBatchWithQcResult,
  GradeQcInput,
  InspectionAnalysis,
} from "../types/qc-types";

const qcKeys = {
  createBatchWithQc: ["qc", "create-batch-with-qc"] as const,
};

type SupabaseMutationResponse<TData> = Promise<{
  data: TData | null;
  error: Error | null;
}>;

type SupabaseTableClient = {
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      maybeSingle: <TData>() => SupabaseMutationResponse<TData>;
    };
    single: <TData>() => SupabaseMutationResponse<TData>;
  };
  insert: (values: Record<string, unknown>) => {
    select: (columns: string) => {
      single: <TData>() => SupabaseMutationResponse<TData>;
    };
  } & PromiseLike<{
    error: Error | null;
  }>;
};

type QcSupabaseClient = ReturnType<typeof getSupabaseBrowserClient> & {
  from: (table: string) => SupabaseTableClient;
};

function createLotNumber() {
  const year = new Date().getFullYear();
  const suffix = Math.random().toString().slice(2, 5).padEnd(3, "0");

  return `LOT-${year}-${suffix}`;
}

function createSupplierCode(supplierName: string) {
  return supplierName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export function useCreateBatchWithQcMutation() {
  return useMutation({
    mutationKey: qcKeys.createBatchWithQc,
    mutationFn: async (input: GradeQcInput): Promise<CreateBatchWithQcResult> => {
      const analysis = await gradeQcAction(input);
      const supabase = getSupabaseBrowserClient() as unknown as QcSupabaseClient;

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const currentUser = userData.user;
      if (!currentUser) {
        throw new Error("You must be logged in to create a batch.");
      }

      const suppliersTable = supabase.from("suppliers") as unknown as SupabaseTableClient;
      const lotsTable = supabase.from("lots") as unknown as SupabaseTableClient;
      const qcInspectionsTable = supabase.from(
        "qc_inspections",
      ) as unknown as SupabaseTableClient;
      const batchEventsTable = supabase.from(
        "batch_events",
      ) as unknown as SupabaseTableClient;

      const { data: existingSupplier, error: supplierLookupError } =
        await suppliersTable
          .select("id, name")
          .eq("name", input.supplier)
          .maybeSingle<{ id: string; name: string }>();

      if (supplierLookupError) {
        throw supplierLookupError;
      }

      let supplierId = existingSupplier?.id;

      if (!supplierId) {
        const { data: createdSupplier, error: createSupplierError } =
          await suppliersTable
            .insert({
              name: input.supplier,
              code: createSupplierCode(input.supplier),
            })
            .select("id")
            .single<{ id: string }>();

        if (createSupplierError) {
          throw createSupplierError;
        }

        if (!createdSupplier) {
          throw new Error("Unable to create supplier record.");
        }

        supplierId = createdSupplier.id;
      }

      const lotNumber = createLotNumber();
      const arrivalDate = new Date().toISOString().slice(0, 10);
      const inspectedAt = new Date().toISOString();

      const { data: createdLot, error: createLotError } = await lotsTable
        .insert({
          lot_number: lotNumber,
          material_name: input.materialType,
          material_type: input.materialType,
          supplier_id: supplierId,
          quantity_kg: input.quantityKg,
          arrival_date: arrivalDate,
          status: "in_qc",
          created_by: currentUser.id,
        })
        .select("id, lot_number")
        .single<{ id: string; lot_number: string }>();

      if (createLotError) {
        throw createLotError;
      }

      if (!createdLot) {
        throw new Error("Unable to create lot record.");
      }

      const { error: createInspectionError } = await qcInspectionsTable
        .insert({
          lot_id: createdLot.id,
          ai_quality_score: analysis.qualityScore,
          ai_colour: analysis.colorAssessment,
          ai_defects: analysis.defects,
          ai_foreign_matter: analysis.foreignMatter,
          ai_recommendation: analysis.recommendation,
          ai_notes: analysis.notes,
          ai_detections: analysis.detections,
          inspected_by: currentUser.id,
          inspected_at: inspectedAt,
        });

      if (createInspectionError) {
        throw createInspectionError;
      }

      const { error: createBatchEventError } = await batchEventsTable
        .insert({
          lot_id: createdLot.id,
          event_type: "qc_graded",
          description: `AI QC completed for ${createdLot.lot_number}.`,
          actor_id: currentUser.id,
          actor_name: currentUser.email ?? "SimaOS Operator",
        });

      if (createBatchEventError) {
        throw createBatchEventError;
      }

      // Generate alerts based on QC results
      const alertsTable = supabase.from("alerts") as unknown as SupabaseTableClient;

      if (analysis.qualityScore < 70) {
        await alertsTable.insert({
          lot_id: createdLot.id,
          alert_type: "high_rejection_risk",
          severity: analysis.qualityScore < 50 ? "critical" : "warning",
          title: "High Rejection Risk",
          description: `${createdLot.lot_number} (${input.materialType}) scored ${analysis.qualityScore}/100 — ${analysis.recommendation}`,
          resolved: false,
        });
      }

      if (analysis.foreignMatter) {
        await alertsTable.insert({
          lot_id: createdLot.id,
          alert_type: "foreign_matter_detected",
          severity: "critical",
          title: "Foreign Matter Detected",
          description: `Foreign matter found in ${createdLot.lot_number} (${input.materialType}) from ${input.supplier}.`,
          resolved: false,
        });
      }

      // Upload inspection image to storage and save to lot_images
      const blob = await fetch(input.imageDataUrl).then((r) => r.blob());
      const ext = blob.type.split("/")[1] || "jpg";
      const path = `${createdLot.id}/${Date.now()}-inspection.${ext}`;
      const { error: uploadError } = await (supabase as unknown as ReturnType<typeof getSupabaseBrowserClient>).storage
        .from("lot-images")
        .upload(path, blob);

      if (!uploadError) {
        const { data: urlData } = (supabase as unknown as ReturnType<typeof getSupabaseBrowserClient>).storage
          .from("lot-images")
          .getPublicUrl(path);

        const lotImagesTable = supabase.from("lot_images") as unknown as SupabaseTableClient;
        await lotImagesTable.insert({
          lot_id: createdLot.id,
          storage_url: urlData.publicUrl,
          uploaded_by: currentUser.id,
        });
      }

      return {
        analysis,
        lotId: createdLot.id,
        lotNumber: createdLot.lot_number,
      };
    },
  });
}

export type { CreateBatchWithQcResult, GradeQcInput, InspectionAnalysis };
