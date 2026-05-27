"use client";

import { useQuery } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export type Lot = {
  id: string;
  lot_number: string;
  material_name: string;
  arrival_date: string;
  status: string;
  supplier: { name: string } | null;
};

const lotsKeys = {
  list: ["lots", "list"] as const,
};

export function useLotsQuery() {
  return useQuery({
    queryKey: lotsKeys.list,
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("lots")
        .select("id, lot_number, material_name, arrival_date, status, supplier:suppliers(name)")
        .order("arrival_date", { ascending: false });

      if (error) throw error;

      return data as Lot[];
    },
  });
}
