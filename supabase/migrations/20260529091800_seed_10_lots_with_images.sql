-- Seed 10 lots with real images matching material types
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
  (gen_random_uuid(), 'Java Harvest Partners', 'java-harvest-partners')
ON CONFLICT (name) DO NOTHING;

SELECT id INTO v_sup1 FROM public.suppliers WHERE code = 'sima-farmer-collective';
SELECT id INTO v_sup2 FROM public.suppliers WHERE code = 'nusantara-spice-co';
SELECT id INTO v_sup3 FROM public.suppliers WHERE code = 'java-harvest-partners';

-- Lot 1: Ginger Root / approved
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, warehouse_zone, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-001', 'Ginger Root', 'Ginger Root', v_sup1, 250, '2026-05-20', 'approved', 'Zone A', v_user_id)
RETURNING id INTO v_lot;
INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot, 88, 'Golden yellow, consistent coloring', '[]'::jsonb, false, 'Accept — excellent quality', 'Fresh ginger with firm texture.', v_user_id, '2026-05-20 09:00:00+07', 'approved');
INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name) VALUES (v_lot, 'qc_graded', 'AI QC completed.', v_user_id, 'operator@simaos.com');
INSERT INTO public.lot_images (lot_id, storage_url, uploaded_by) VALUES (v_lot, 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800', v_user_id);

-- Lot 2: Turmeric / approved
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, warehouse_zone, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-002', 'Turmeric', 'Turmeric', v_sup2, 180, '2026-05-21', 'approved', 'Zone B', v_user_id)
RETURNING id INTO v_lot;
INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot, 92, 'Deep orange, vibrant pigmentation', '[]'::jsonb, false, 'Accept — premium grade', 'High curcumin content indicators.', v_user_id, '2026-05-21 10:30:00+07', 'approved');
INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name) VALUES (v_lot, 'qc_graded', 'AI QC completed.', v_user_id, 'operator@simaos.com');
INSERT INTO public.lot_images (lot_id, storage_url, uploaded_by) VALUES (v_lot, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800', v_user_id);

-- Lot 3: Cinnamon Bark / in_qc
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-003', 'Cinnamon Bark', 'Cinnamon Bark', v_sup3, 120, '2026-05-22', 'in_qc', v_user_id)
RETURNING id INTO v_lot;
INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at)
VALUES (v_lot, 74, 'Medium brown, slight discoloration', '["minor_bark_splitting"]'::jsonb, false, 'Accept with conditions', 'Some bark splitting observed.', v_user_id, '2026-05-22 08:15:00+07');
INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name) VALUES (v_lot, 'qc_graded', 'AI QC completed.', v_user_id, 'operator@simaos.com');
INSERT INTO public.lot_images (lot_id, storage_url, uploaded_by) VALUES (v_lot, 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800', v_user_id);

-- Lot 4: Clove Buds / rejected
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-004', 'Clove Buds', 'Clove Buds', v_sup1, 90, '2026-05-23', 'rejected', v_user_id)
RETURNING id INTO v_lot;
INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot, 42, 'Dark brown with black spots', '["mold_presence","insect_damage"]'::jsonb, true, 'Reject — contamination', 'Visible mold on 30% of buds.', v_user_id, '2026-05-23 14:00:00+07', 'rejected');
INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name) VALUES (v_lot, 'qc_graded', 'AI QC completed.', v_user_id, 'operator@simaos.com');
INSERT INTO public.lot_images (lot_id, storage_url, uploaded_by) VALUES (v_lot, 'https://images.unsplash.com/photo-1599909533601-aa23a47b5eda?w=800', v_user_id);

-- Lot 5: Black Pepper / approved
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, warehouse_zone, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-005', 'Black Pepper', 'Black Pepper', v_sup2, 300, '2026-05-24', 'approved', 'Zone A', v_user_id)
RETURNING id INTO v_lot;
INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot, 85, 'Dark black, uniform size', '[]'::jsonb, false, 'Accept — good quality', 'Consistent peppercorn size.', v_user_id, '2026-05-24 11:00:00+07', 'approved');
INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name) VALUES (v_lot, 'qc_graded', 'AI QC completed.', v_user_id, 'operator@simaos.com');
INSERT INTO public.lot_images (lot_id, storage_url, uploaded_by) VALUES (v_lot, 'https://images.unsplash.com/photo-1599909631715-cd24c1a754c0?w=800', v_user_id);

-- Lot 6: Nutmeg / in_qc
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-006', 'Nutmeg', 'Nutmeg', v_sup3, 75, '2026-05-25', 'in_qc', v_user_id)
RETURNING id INTO v_lot;
INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at)
VALUES (v_lot, 79, 'Light brown, natural sheen', '["minor_surface_cracks"]'::jsonb, false, 'Accept with conditions', 'Minor surface cracks on some seeds.', v_user_id, '2026-05-25 09:45:00+07');
INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name) VALUES (v_lot, 'qc_graded', 'AI QC completed.', v_user_id, 'operator@simaos.com');
INSERT INTO public.lot_images (lot_id, storage_url, uploaded_by) VALUES (v_lot, 'https://images.unsplash.com/photo-1638788614798-a4dd5dab4120?w=800', v_user_id);

-- Lot 7: Ginger Root / approved
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, warehouse_zone, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-007', 'Ginger Root', 'Ginger Root', v_sup3, 200, '2026-05-26', 'approved', 'Zone A', v_user_id)
RETURNING id INTO v_lot;
INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot, 81, 'Pale yellow, slightly dry', '[]'::jsonb, false, 'Accept — standard grade', 'Acceptable quality.', v_user_id, '2026-05-26 10:00:00+07', 'approved');
INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name) VALUES (v_lot, 'qc_graded', 'AI QC completed.', v_user_id, 'operator@simaos.com');
INSERT INTO public.lot_images (lot_id, storage_url, uploaded_by) VALUES (v_lot, 'https://images.unsplash.com/photo-1573414404900-3506e5069625?w=800', v_user_id);

-- Lot 8: Turmeric / in_qc
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-008', 'Turmeric', 'Turmeric', v_sup1, 150, '2026-05-27', 'in_qc', v_user_id)
RETURNING id INTO v_lot;
INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at)
VALUES (v_lot, 70, 'Orange with pale patches', '["uneven_drying"]'::jsonb, false, 'Accept with conditions', 'Uneven coloring suggests inconsistent drying.', v_user_id, '2026-05-27 13:30:00+07');
INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name) VALUES (v_lot, 'qc_graded', 'AI QC completed.', v_user_id, 'operator@simaos.com');
INSERT INTO public.lot_images (lot_id, storage_url, uploaded_by) VALUES (v_lot, 'https://images.unsplash.com/photo-1607198179219-cd8b3b3b5048?w=800', v_user_id);

-- Lot 9: Black Pepper / approved
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, warehouse_zone, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-009', 'Black Pepper', 'Black Pepper', v_sup1, 220, '2026-05-28', 'approved', 'Zone B', v_user_id)
RETURNING id INTO v_lot;
INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot, 90, 'Jet black, excellent uniformity', '[]'::jsonb, false, 'Accept — premium grade', 'Top-tier peppercorns.', v_user_id, '2026-05-28 08:00:00+07', 'approved');
INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name) VALUES (v_lot, 'qc_graded', 'AI QC completed.', v_user_id, 'operator@simaos.com');
INSERT INTO public.lot_images (lot_id, storage_url, uploaded_by) VALUES (v_lot, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800', v_user_id);

-- Lot 10: Nutmeg / rejected
INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, created_by)
VALUES (gen_random_uuid(), 'LOT-2026-010', 'Nutmeg', 'Nutmeg', v_sup2, 60, '2026-05-29', 'rejected', v_user_id)
RETURNING id INTO v_lot;
INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, inspected_by, inspected_at, human_decision)
VALUES (v_lot, 38, 'Grey-brown, dull appearance', '["heavy_mold","worm_holes"]'::jsonb, true, 'Reject — severe quality failure', 'Extensive mold and worm damage.', v_user_id, '2026-05-29 07:30:00+07', 'rejected');
INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name) VALUES (v_lot, 'qc_graded', 'AI QC completed.', v_user_id, 'operator@simaos.com');
INSERT INTO public.lot_images (lot_id, storage_url, uploaded_by) VALUES (v_lot, 'https://images.unsplash.com/photo-1590677880200-f027e4e0c3f6?w=800', v_user_id);

-- Alerts
INSERT INTO public.alerts (lot_id, alert_type, severity, title, description)
SELECT id, 'high_rejection_risk', 'high', 'High Rejection Risk — ' || lot_number, 'AI quality score below 60. Immediate review required.'
FROM public.lots WHERE status = 'rejected';

INSERT INTO public.alerts (lot_id, alert_type, severity, title, description)
SELECT id, 'qc_delay', 'medium', 'QC Pending — ' || lot_number, 'Lot awaiting human QC decision.'
FROM public.lots WHERE status = 'in_qc';

END $$;
