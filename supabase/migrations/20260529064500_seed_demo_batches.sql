-- Seed demo batches for user ce41fe5c-450e-442c-bd01-e9206ed877fd
DO $$
DECLARE
  v_user_id uuid := 'ce41fe5c-450e-442c-bd01-e9206ed877fd';
  v_sup1 uuid;
  v_sup2 uuid;
  v_sup3 uuid;
  v_lot uuid;
BEGIN

-- Suppliers
INSERT INTO public.suppliers (id, name, code) VALUES
  (gen_random_uuid(), 'Sima Farmer Collective', 'sima-farmer-collective'),
  (gen_random_uuid(), 'Nusantara Spice Co.', 'nusantara-spice-co'),
  (gen_random_uuid(), 'Java Harvest Partners', 'java-harvest-partners');

SELECT id INTO v_sup1 FROM public.suppliers WHERE code = 'sima-farmer-collective';
SELECT id INTO v_sup2 FROM public.suppliers WHERE code = 'nusantara-spice-co';
SELECT id INTO v_sup3 FROM public.suppliers WHERE code = 'java-harvest-partners';

-- Lot 1: Ginger Root / Sima Farmer Collective / approved
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, warehouse_zone, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-001', 'Ginger Root', 'Ginger Root', v_sup1, 250, '2026-05-20', 'approved', 'Zone A', v_user_id)
RETURNING id INTO v_lot;

INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot, 88, 'Golden yellow, consistent coloring', '[]'::jsonb, false, 'Accept — excellent quality', 'Fresh ginger with firm texture and no visible mold.', v_user_id, '2026-05-20 09:00:00+07', 'approved');

INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name)
VALUES (v_lot, 'qc_graded', 'AI QC completed for LOT-2026-001.', v_user_id, 'operator@simaos.com');

-- Lot 2: Turmeric / Nusantara Spice Co. / approved
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, warehouse_zone, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-002', 'Turmeric', 'Turmeric', v_sup2, 180, '2026-05-21', 'approved', 'Zone B', v_user_id)
RETURNING id INTO v_lot;

INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot, 92, 'Deep orange, vibrant pigmentation', '[]'::jsonb, false, 'Accept — premium grade', 'High curcumin content indicators visible.', v_user_id, '2026-05-21 10:30:00+07', 'approved');

INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name)
VALUES (v_lot, 'qc_graded', 'AI QC completed for LOT-2026-002.', v_user_id, 'operator@simaos.com');

-- Lot 3: Cinnamon Bark / Java Harvest Partners / in_qc
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-003', 'Cinnamon Bark', 'Cinnamon Bark', v_sup3, 120, '2026-05-22', 'in_qc', v_user_id)
RETURNING id INTO v_lot;

INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at)
VALUES (v_lot, 74, 'Medium brown, slight discoloration on edges', '["minor_bark_splitting"]'::jsonb, false, 'Accept with conditions — monitor storage', 'Some bark splitting observed but within tolerance.', v_user_id, '2026-05-22 08:15:00+07');

INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name)
VALUES (v_lot, 'qc_graded', 'AI QC completed for LOT-2026-003.', v_user_id, 'operator@simaos.com');

-- Lot 4: Clove Buds / Sima Farmer Collective / rejected
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-004', 'Clove Buds', 'Clove Buds', v_sup1, 90, '2026-05-23', 'rejected', v_user_id)
RETURNING id INTO v_lot;

INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot, 42, 'Dark brown, uneven coloring with black spots', '["mold_presence", "insect_damage"]'::jsonb, true, 'Reject — contamination detected', 'Visible mold on 30% of buds. Foreign matter particles found.', v_user_id, '2026-05-23 14:00:00+07', 'rejected');

INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name)
VALUES (v_lot, 'qc_graded', 'AI QC completed for LOT-2026-004.', v_user_id, 'operator@simaos.com');

-- Lot 5: Black Pepper / Nusantara Spice Co. / approved
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, warehouse_zone, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-005', 'Black Pepper', 'Black Pepper', v_sup2, 300, '2026-05-24', 'approved', 'Zone A', v_user_id)
RETURNING id INTO v_lot;

INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot, 85, 'Dark black, uniform size distribution', '[]'::jsonb, false, 'Accept — good quality', 'Consistent peppercorn size. No visible contamination.', v_user_id, '2026-05-24 11:00:00+07', 'approved');

INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name)
VALUES (v_lot, 'qc_graded', 'AI QC completed for LOT-2026-005.', v_user_id, 'operator@simaos.com');

-- Lot 6: Nutmeg / Java Harvest Partners / in_qc
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-006', 'Nutmeg', 'Nutmeg', v_sup3, 75, '2026-05-25', 'in_qc', v_user_id)
RETURNING id INTO v_lot;

INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at)
VALUES (v_lot, 79, 'Light brown, natural sheen present', '["minor_surface_cracks"]'::jsonb, false, 'Accept with conditions — verify moisture content', 'Minor surface cracks on some seeds. Recommend moisture testing.', v_user_id, '2026-05-25 09:45:00+07');

INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name)
VALUES (v_lot, 'qc_graded', 'AI QC completed for LOT-2026-006.', v_user_id, 'operator@simaos.com');

-- Lot 7: Ginger Root / Java Harvest Partners / approved
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, warehouse_zone, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-007', 'Ginger Root', 'Ginger Root', v_sup3, 200, '2026-05-26', 'approved', 'Zone A', v_user_id)
RETURNING id INTO v_lot;

INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot, 81, 'Pale yellow, slightly dry exterior', '[]'::jsonb, false, 'Accept — standard grade', 'Acceptable quality. Slightly drier than premium lots.', v_user_id, '2026-05-26 10:00:00+07', 'approved');

INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name)
VALUES (v_lot, 'qc_graded', 'AI QC completed for LOT-2026-007.', v_user_id, 'operator@simaos.com');

-- Lot 8: Turmeric / Sima Farmer Collective / in_qc
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-008', 'Turmeric', 'Turmeric', v_sup1, 150, '2026-05-27', 'in_qc', v_user_id)
RETURNING id INTO v_lot;

INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at)
VALUES (v_lot, 70, 'Orange with pale patches', '["uneven_drying"]'::jsonb, false, 'Accept with conditions — recheck drying process', 'Uneven coloring suggests inconsistent drying. Functional quality intact.', v_user_id, '2026-05-27 13:30:00+07');

INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name)
VALUES (v_lot, 'qc_graded', 'AI QC completed for LOT-2026-008.', v_user_id, 'operator@simaos.com');

-- Lot 9: Black Pepper / Sima Farmer Collective / approved
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, warehouse_zone, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-009', 'Black Pepper', 'Black Pepper', v_sup1, 220, '2026-05-28', 'approved', 'Zone B', v_user_id)
RETURNING id INTO v_lot;

INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot, 90, 'Jet black, excellent uniformity', '[]'::jsonb, false, 'Accept — premium grade', 'Top-tier peppercorns. Strong aroma detected visually.', v_user_id, '2026-05-28 08:00:00+07', 'approved');

INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name)
VALUES (v_lot, 'qc_graded', 'AI QC completed for LOT-2026-009.', v_user_id, 'operator@simaos.com');

-- Lot 10: Nutmeg / Nusantara Spice Co. / rejected
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-010', 'Nutmeg', 'Nutmeg', v_sup2, 60, '2026-05-29', 'rejected', v_user_id)
RETURNING id INTO v_lot;

INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot, 38, 'Grey-brown, dull appearance', '["heavy_mold", "worm_holes"]'::jsonb, true, 'Reject — severe quality failure', 'Extensive mold coverage and worm damage. Not salvageable.', v_user_id, '2026-05-29 07:30:00+07', 'rejected');

INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name)
VALUES (v_lot, 'qc_graded', 'AI QC completed for LOT-2026-010.', v_user_id, 'operator@simaos.com');

END $$;
