"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export type KnowledgeNote = {
  id: string;
  note_type: string;
  content: string;
  material_name: string | null;
  created_at: string;
};

const knowledgeKeys = {
  byLot: (lotId: string) => ["knowledge-notes", lotId] as const,
};

export function useKnowledgeNotesQuery(lotId: string) {
  return useQuery({
    queryKey: knowledgeKeys.byLot(lotId),
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await (supabase
        .from("knowledge_notes") as any)
        .select("id, note_type, content, material_name, created_at")
        .eq("lot_id", lotId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as KnowledgeNote[];
    },
  });
}

export function useCreateKnowledgeNoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { lotId: string; materialName: string; noteType: string; content: string }) => {
      const supabase = getSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error } = await (supabase.from("knowledge_notes") as any).insert({
        lot_id: input.lotId,
        material_name: input.materialName,
        note_type: input.noteType,
        content: input.content,
        created_by: userData.user.id,
      });
      if (error) throw error;
    },
    onSuccess: (_, { lotId }) => {
      queryClient.invalidateQueries({ queryKey: knowledgeKeys.byLot(lotId) });
    },
  });
}
