-- Seed operational alerts based on existing lots
INSERT INTO public.alerts (lot_id, alert_type, severity, title, description)
SELECT id, 'high_rejection_risk', 'high',
  'High Rejection Risk — ' || lot_number,
  'AI quality score below 60 for ' || material_name || '. Immediate review required.'
FROM public.lots WHERE status = 'rejected';

INSERT INTO public.alerts (lot_id, alert_type, severity, title, description)
SELECT id, 'qc_delay', 'medium',
  'QC Pending — ' || lot_number,
  material_name || ' lot awaiting human QC decision for over 24 hours.'
FROM public.lots WHERE status = 'in_qc';

INSERT INTO public.alerts (lot_id, alert_type, severity, title, description)
SELECT id, 'storage_assignment_pending', 'low',
  'Zone Assignment Needed — ' || lot_number,
  material_name || ' approved but no warehouse zone assigned yet.'
FROM public.lots WHERE status = 'approved' AND warehouse_zone IS NULL;
