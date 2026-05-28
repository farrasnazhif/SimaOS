"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export type Lot = {
  id: string;
  lot_number: string;
  material_name: string;
  arrival_date: string;
  status: string;
  warehouse_zone: string | null;
  quantity_kg: number;
  supplier: { name: string } | null;
};

export type LotDetail = {
  id: string;
  lot_number: string;
  material_name: string;
  material_type: string;
  quantity_kg: number;
  arrival_date: string;
  status: string;
  warehouse_zone: string | null;
  created_at: string;
  supplier: { name: string } | null;
  qc_inspections: {
    id: string;
    ai_quality_score: number;
    ai_colour: string | null;
    ai_defects: string[] | null;
    ai_foreign_matter: boolean;
    ai_recommendation: string | null;
    ai_notes: string | null;
    human_decision: string | null;
    human_notes: string | null;
    inspected_at: string;
  }[];
  batch_events: {
    id: string;
    event_type: string;
    description: string | null;
    actor_name: string | null;
    created_at: string;
  }[];
  lot_images: {
    id: string;
    storage_url: string;
    uploaded_at: string;
  }[];
};

const lotsKeys = {
  list: ["lots", "list"] as const,
  detail: (id: string) => ["lots", "detail", id] as const,
};

export function useLotsQuery() {
  return useQuery({
    queryKey: lotsKeys.list,
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("lots")
        .select("id, lot_number, material_name, arrival_date, status, warehouse_zone, quantity_kg, supplier:suppliers(name)")
        .order("arrival_date", { ascending: false });
      if (error) throw error;
      return data as Lot[];
    },
  });
}

export function useLotDetailQuery(id: string) {
  return useQuery({
    queryKey: lotsKeys.detail(id),
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await (supabase
        .from("lots") as any)
        .select(`
          id, lot_number, material_name, material_type, quantity_kg, arrival_date, status, warehouse_zone, created_at,
          supplier:suppliers(name),
          qc_inspections(id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, human_decision, human_notes, inspected_at),
          batch_events(id, event_type, description, actor_name, created_at),
          lot_images(id, storage_url, uploaded_at)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as unknown as LotDetail;
    },
  });
}

export function useAssignZoneMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ lotId, zone }: { lotId: string; zone: string }) => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await (supabase
        .from("lots") as any)
        .update({ warehouse_zone: zone, updated_at: new Date().toISOString() })
        .eq("id", lotId);
      if (error) throw error;
    },
    onSuccess: (_, { lotId }) => {
      queryClient.invalidateQueries({ queryKey: lotsKeys.detail(lotId) });
      queryClient.invalidateQueries({ queryKey: lotsKeys.list });
    },
  });
}

export function useUploadLotImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ lotId, file }: { lotId: string; file: File }) => {
      const supabase = getSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const path = `${lotId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("lot-images")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("lot-images").getPublicUrl(path);

      const { error: insertError } = await (supabase.from("lot_images") as any).insert({
        lot_id: lotId,
        storage_url: urlData.publicUrl,
        uploaded_by: userData.user.id,
      });
      if (insertError) throw insertError;
    },
    onSuccess: (_, { lotId }) => {
      queryClient.invalidateQueries({ queryKey: lotsKeys.detail(lotId) });
    },
  });
}
