-- Allow authenticated users to delete their own lots and related records
CREATE POLICY "Users can delete their own lots"
  ON public.lots FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Users can delete lot_images for their lots"
  ON public.lot_images FOR DELETE TO authenticated
  USING (lot_id IN (SELECT id FROM public.lots WHERE created_by = auth.uid()));

CREATE POLICY "Users can delete batch_events for their lots"
  ON public.batch_events FOR DELETE TO authenticated
  USING (lot_id IN (SELECT id FROM public.lots WHERE created_by = auth.uid()));

CREATE POLICY "Users can delete qc_inspections for their lots"
  ON public.qc_inspections FOR DELETE TO authenticated
  USING (lot_id IN (SELECT id FROM public.lots WHERE created_by = auth.uid()));

CREATE POLICY "Users can delete alerts for their lots"
  ON public.alerts FOR DELETE TO authenticated
  USING (lot_id IN (SELECT id FROM public.lots WHERE created_by = auth.uid()));
