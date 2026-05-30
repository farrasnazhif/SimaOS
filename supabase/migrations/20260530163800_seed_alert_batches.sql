DO $$
DECLARE
  v_user_id uuid := 'cbf49a2c-e543-4a6b-be93-b6d255ff1c04';
  v_sup1 uuid;
  v_sup2 uuid;
  v_lot1 uuid;
  v_lot2 uuid;
BEGIN

-- Suppliers
INSERT INTO public.suppliers (id, name, code) VALUES
  (gen_random_uuid(), 'Nusantara Spice Co.', 'nusantara-spice-co'),
  (gen_random_uuid(), 'Java Harvest Partners', 'java-harvest-partners')
ON CONFLICT (code) DO NOTHING;

SELECT id INTO v_sup1 FROM public.suppliers WHERE code = 'nusantara-spice-co';
SELECT id INTO v_sup2 FROM public.suppliers WHERE code = 'java-harvest-partners';

-- Lot 1: Low quality score → critical alert
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-301', 'Turmeric', 'Turmeric', v_sup1, 180, '2026-05-29', 'in_qc', v_user_id)
RETURNING id INTO v_lot1;

INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at)
VALUES (v_lot1, 38, 'Dark brown with black spots', '["mold presence","discoloration","foreign particles"]'::jsonb, true, 'Reject — critical contamination detected', 'Severe discoloration and foreign matter found. Not suitable for production.', v_user_id, now());

INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name)
VALUES (v_lot1, 'qc_graded', 'AI QC completed for LOT-2026-301.', v_user_id, 'operator@simaos.com');

INSERT INTO public.alerts (lot_id, alert_type, severity, title, description, resolved)
VALUES
  (v_lot1, 'high_rejection_risk', 'critical', 'High Rejection Risk', 'LOT-2026-301 (Turmeric) scored 38/100 — Reject — critical contamination detected', false),
  (v_lot1, 'foreign_matter_detected', 'critical', 'Foreign Matter Detected', 'Foreign matter found in LOT-2026-301 (Turmeric) from Nusantara Spice Co.', false);

-- Lot 2: Moderate score, approved but no zone → maintenance/warning alert
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-302', 'Cinnamon Bark', 'Cinnamon Bark', v_sup2, 320, '2026-05-28', 'approved', v_user_id)
RETURNING id INTO v_lot2;

INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot2, 74, 'Light tan, slightly uneven', '["minor surface scratches"]'::jsonb, false, 'Accept with conditions', 'Acceptable quality but requires proper storage conditions.', v_user_id, '2026-05-28 10:00:00+07', 'approved');

INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name)
VALUES
  (v_lot2, 'qc_graded', 'AI QC completed for LOT-2026-302.', v_user_id, 'operator@simaos.com'),
  (v_lot2, 'human_approved', 'Batch approved by operator.', v_user_id, 'operator@simaos.com');

INSERT INTO public.alerts (lot_id, alert_type, severity, title, description, resolved)
VALUES (v_lot2, 'storage_assignment_pending', 'warning', 'Storage Assignment Pending', 'LOT-2026-302 (Cinnamon Bark) approved but no warehouse zone assigned.', false);

END $$;
