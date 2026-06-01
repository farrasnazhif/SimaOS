-- Fix: allow any authenticated user to update lots and qc_inspections
-- (approve/reject should work regardless of who created the batch)

drop policy "Users can update their own lots" on public.lots;
create policy "Authenticated users can update lots"
  on public.lots for update to authenticated using (true);

drop policy "Users can update their own qc_inspections" on public.qc_inspections;
create policy "Authenticated users can update qc_inspections"
  on public.qc_inspections for update to authenticated using (true);
