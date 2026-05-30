"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export type Alert = {
  id: string;
  lot_id: string | null;
  alert_type: string;
  severity: string;
  title: string;
  description: string | null;
  resolved: boolean;
  created_at: string;
};

export function useAlertsQuery() {
  return useQuery({
    queryKey: ["alerts", "active"],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await (supabase
        .from("alerts") as any)
        .select("*")
        .eq("resolved", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Alert[];
    },
  });
}

export function useResolveAlertMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (alertId: string) => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await (supabase
        .from("alerts") as any)
        .update({ resolved: true })
        .eq("id", alertId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts", "active"] });
    },
  });
}

export function useArchivedAlertsQuery() {
  return useQuery({
    queryKey: ["alerts", "archived"],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await (supabase
        .from("alerts") as any)
        .select("*")
        .eq("resolved", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Alert[];
    },
  });
}

export function useRestoreAlertMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (alertId: string) => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await (supabase
        .from("alerts") as any)
        .update({ resolved: false })
        .eq("id", alertId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts", "active"] });
      queryClient.invalidateQueries({ queryKey: ["alerts", "archived"] });
    },
  });
}
