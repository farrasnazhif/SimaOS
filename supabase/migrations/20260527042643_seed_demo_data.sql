-- Seed demo data
DO $$
DECLARE
  v_user_id uuid;
  v_sup1 uuid;
  v_sup2 uuid;
  v_sup3 uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No auth user found, skipping seed';
    RETURN;
  END IF;

  -- Upsert suppliers and get their IDs
  INSERT INTO public.suppliers (name, code) VALUES ('Sima Farmer Collective', 'sima-farmer-collective')
    ON CONFLICT (name) DO NOTHING;
  INSERT INTO public.suppliers (name, code) VALUES ('Nusantara Spice Co.', 'nusantara-spice-co')
    ON CONFLICT (name) DO NOTHING;
  INSERT INTO public.suppliers (name, code) VALUES ('Java Harvest Partners', 'java-harvest-partners')
    ON CONFLICT (name) DO NOTHING;

  SELECT id INTO v_sup1 FROM public.suppliers WHERE name = 'Sima Farmer Collective';
  SELECT id INTO v_sup2 FROM public.suppliers WHERE name = 'Nusantara Spice Co.';
  SELECT id INTO v_sup3 FROM public.suppliers WHERE name = 'Java Harvest Partners';

  -- Lots
  INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, warehouse_zone, created_by, updated_at) VALUES
    ('b1000000-0000-0000-0000-000000000001', 'LOT-2026-001', 'Turmeric', 'Turmeric', v_sup1, 320, '2026-05-20', 'approved', 'Zone A — Dry Storage', v_user_id, now()),
    ('b1000000-0000-0000-0000-000000000002', 'LOT-2026-002', 'Ginger Root', 'Ginger Root', v_sup2, 450, '2026-05-22', 'in_qc', NULL, v_user_id, now()),
    ('b1000000-0000-0000-0000-000000000003', 'LOT-2026-003', 'Pandan Leaf', 'Pandan Leaf', v_sup3, 180, '2026-05-23', 'rejected', NULL, v_user_id, now()),
    ('b1000000-0000-0000-0000-000000000004', 'LOT-2026-004', 'Lemongrass', 'Lemongrass', v_sup1, 275, '2026-05-24', 'in_production', 'Zone D — Processing Queue', v_user_id, now()),
    ('b1000000-0000-0000-0000-000000000005', 'LOT-2026-005', 'Clove Extract', 'Clove Extract', v_sup2, 120, '2026-05-26', 'arriving', NULL, v_user_id, now())
  ON CONFLICT (lot_number) DO NOTHING;

  -- QC Inspections
  INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, human_decision, human_notes, inspected_by, inspected_at) VALUES
    ('b1000000-0000-0000-0000-000000000001', 88, 'Deep golden-orange, consistent', '[]'::jsonb, false, 'Approve — excellent quality', 'Uniform color and texture. No visible contaminants.', 'approved', 'Confirmed. Excellent batch.', v_user_id, '2026-05-20 09:30:00+07'),
    ('b1000000-0000-0000-0000-000000000002', 72, 'Pale yellow with brown spots', '["surface moisture", "minor discoloration"]'::jsonb, false, 'Conditional approval — monitor moisture', 'Some surface moisture detected. Recommend drying before processing.', NULL, NULL, v_user_id, '2026-05-22 10:15:00+07'),
    ('b1000000-0000-0000-0000-000000000003', 45, 'Browning edges, wilted appearance', '["wilting", "browning", "possible mold"]'::jsonb, true, 'Reject — quality below threshold', 'Significant quality degradation. Foreign matter detected in sample.', 'rejected', 'Rejected due to mold risk.', v_user_id, '2026-05-23 11:00:00+07')
  ON CONFLICT DO NOTHING;

  -- Batch Events
  INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name) VALUES
    ('b1000000-0000-0000-0000-000000000001', 'lot_created', 'Lot received from Sima Farmer Collective.', v_user_id, 'System'),
    ('b1000000-0000-0000-0000-000000000001', 'qc_graded', 'AI QC completed. Score: 88/100.', v_user_id, 'AI Engine'),
    ('b1000000-0000-0000-0000-000000000001', 'human_approved', 'Lot approved by operator.', v_user_id, 'Operator'),
    ('b1000000-0000-0000-0000-000000000001', 'zone_assigned', 'Assigned to Zone A — Dry Storage.', v_user_id, 'Operator'),
    ('b1000000-0000-0000-0000-000000000002', 'lot_created', 'Lot received from Nusantara Spice Co.', v_user_id, 'System'),
    ('b1000000-0000-0000-0000-000000000002', 'qc_graded', 'AI QC completed. Score: 72/100. Moisture alert raised.', v_user_id, 'AI Engine'),
    ('b1000000-0000-0000-0000-000000000003', 'lot_created', 'Lot received from Java Harvest Partners.', v_user_id, 'System'),
    ('b1000000-0000-0000-0000-000000000003', 'qc_graded', 'AI QC completed. Score: 45/100. Rejected.', v_user_id, 'AI Engine'),
    ('b1000000-0000-0000-0000-000000000003', 'human_rejected', 'Lot rejected due to mold risk.', v_user_id, 'Operator');

  -- Alerts
  INSERT INTO public.alerts (lot_id, alert_type, severity, title, description, resolved) VALUES
    ('b1000000-0000-0000-0000-000000000002', 'high_rejection_risk', 'high', 'High Rejection Risk', 'LOT-2026-002 scored 72 — below optimal threshold. Moisture detected.', false),
    ('b1000000-0000-0000-0000-000000000003', 'supplier_quality_declining', 'medium', 'Supplier Quality Declining', 'Java Harvest Partners rejection rate exceeds 30% this month.', false),
    ('b1000000-0000-0000-0000-000000000002', 'qc_delay', 'low', 'QC Decision Pending', 'LOT-2026-002 has been in QC for over 48 hours without human decision.', false);

  -- Knowledge Notes
  INSERT INTO public.knowledge_notes (lot_id, material_name, note_type, content, created_by) VALUES
    ('b1000000-0000-0000-0000-000000000001', 'Turmeric', 'observation', 'Supplier frequently delivers darker turmeric. Historical approval rate remains above 90%.', v_user_id),
    ('b1000000-0000-0000-0000-000000000001', 'Turmeric', 'recommendation', 'Darker color from this supplier is acceptable — extraction yields are consistently high.', v_user_id),
    ('b1000000-0000-0000-0000-000000000003', 'Pandan Leaf', 'historical_insight', 'Rainy-season deliveries from Java Harvest show elevated moisture risk. Consider additional drying step.', v_user_id);

END $$;
