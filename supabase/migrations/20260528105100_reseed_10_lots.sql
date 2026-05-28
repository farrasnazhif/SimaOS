-- Clear existing demo data and reseed with 10 lots including images and detections
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

  -- Clear existing data (order matters for FK constraints)
  DELETE FROM public.lot_images;
  DELETE FROM public.knowledge_notes;
  DELETE FROM public.alerts;
  DELETE FROM public.batch_events;
  DELETE FROM public.qc_inspections;
  DELETE FROM public.lots;

  SELECT id INTO v_sup1 FROM public.suppliers WHERE name = 'Sima Farmer Collective';
  SELECT id INTO v_sup2 FROM public.suppliers WHERE name = 'Nusantara Spice Co.';
  SELECT id INTO v_sup3 FROM public.suppliers WHERE name = 'Java Harvest Partners';

  -- 10 Lots
  INSERT INTO public.lots (id, lot_number, material_name, material_type, supplier_id, quantity_kg, arrival_date, status, warehouse_zone, created_by, updated_at) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'LOT-2026-101', 'Turmeric', 'Turmeric', v_sup1, 320, '2026-05-15', 'approved', 'Zone A — Dry Storage', v_user_id, now()),
    ('a0000000-0000-0000-0000-000000000002', 'LOT-2026-102', 'Ginger Root', 'Ginger Root', v_sup2, 450, '2026-05-16', 'in_qc', NULL, v_user_id, now()),
    ('a0000000-0000-0000-0000-000000000003', 'LOT-2026-103', 'Cinnamon Bark', 'Cinnamon Bark', v_sup3, 180, '2026-05-17', 'approved', 'Zone B — Spice Rack', v_user_id, now()),
    ('a0000000-0000-0000-0000-000000000004', 'LOT-2026-104', 'Clove Buds', 'Clove Buds', v_sup1, 95, '2026-05-18', 'rejected', NULL, v_user_id, now()),
    ('a0000000-0000-0000-0000-000000000005', 'LOT-2026-105', 'Lemongrass', 'Lemongrass', v_sup2, 275, '2026-05-19', 'in_production', 'Zone D — Processing Queue', v_user_id, now()),
    ('a0000000-0000-0000-0000-000000000006', 'LOT-2026-106', 'Black Pepper', 'Black Pepper', v_sup3, 520, '2026-05-20', 'approved', 'Zone C — Cool Storage', v_user_id, now()),
    ('a0000000-0000-0000-0000-000000000007', 'LOT-2026-107', 'Cardamom', 'Cardamom', v_sup1, 60, '2026-05-21', 'in_qc', NULL, v_user_id, now()),
    ('a0000000-0000-0000-0000-000000000008', 'LOT-2026-108', 'Nutmeg', 'Nutmeg', v_sup2, 140, '2026-05-22', 'arriving', NULL, v_user_id, now()),
    ('a0000000-0000-0000-0000-000000000009', 'LOT-2026-109', 'Star Anise', 'Star Anise', v_sup3, 200, '2026-05-23', 'approved', 'Zone A — Dry Storage', v_user_id, now()),
    ('a0000000-0000-0000-0000-000000000010', 'LOT-2026-110', 'Vanilla Bean', 'Vanilla Bean', v_sup1, 30, '2026-05-24', 'in_qc', NULL, v_user_id, now());

  -- QC Inspections (for lots that have been inspected)
  INSERT INTO public.qc_inspections (lot_id, ai_quality_score, ai_colour, ai_defects, ai_foreign_matter, ai_recommendation, ai_notes, ai_detections, human_decision, human_notes, inspected_by, inspected_at) VALUES
    ('a0000000-0000-0000-0000-000000000001', 92, 'Deep golden-orange, uniform', '[]'::jsonb, false, 'Approve — premium grade turmeric', 'Excellent curcumin color saturation. No contaminants visible.', '[{"label":"prime region","x":8,"y":10,"width":50,"height":55},{"label":"color sample","x":60,"y":35,"width":30,"height":40}]'::jsonb, 'approved', 'Confirmed premium grade.', v_user_id, '2026-05-15 09:30:00+07'),
    ('a0000000-0000-0000-0000-000000000002', 68, 'Pale yellow, uneven tone', '["surface moisture","minor bruising"]'::jsonb, false, 'Conditional — dry before processing', 'Moisture content appears elevated. Some mechanical damage from transport.', '[{"label":"moisture spot","x":12,"y":20,"width":35,"height":30},{"label":"bruising","x":55,"y":50,"width":25,"height":28}]'::jsonb, NULL, NULL, v_user_id, '2026-05-16 10:00:00+07'),
    ('a0000000-0000-0000-0000-000000000003', 85, 'Rich reddish-brown, consistent', '[]'::jsonb, false, 'Approve — good quality bark', 'Tight curl pattern indicates proper drying. Aromatic profile strong.', '[{"label":"bark quality","x":5,"y":8,"width":55,"height":60},{"label":"curl pattern","x":62,"y":30,"width":30,"height":45}]'::jsonb, 'approved', 'Good batch, approved.', v_user_id, '2026-05-17 11:15:00+07'),
    ('a0000000-0000-0000-0000-000000000004', 35, 'Dark brown with grey patches', '["mold spots","insect damage","discoloration"]'::jsonb, true, 'Reject — contamination detected', 'Multiple mold colonies visible. Evidence of stored grain pest activity.', '[{"label":"mold colony","x":10,"y":15,"width":30,"height":25},{"label":"insect damage","x":50,"y":10,"width":28,"height":22},{"label":"foreign particle","x":35,"y":55,"width":20,"height":20}]'::jsonb, 'rejected', 'Rejected. Supplier notified.', v_user_id, '2026-05-18 08:45:00+07'),
    ('a0000000-0000-0000-0000-000000000005', 79, 'Fresh green, slight yellowing at tips', '["tip yellowing"]'::jsonb, false, 'Approve — acceptable for extraction', 'Minor age-related yellowing. Core stalks remain fresh and aromatic.', '[{"label":"fresh stalk","x":10,"y":5,"width":40,"height":70},{"label":"yellowing tips","x":55,"y":60,"width":30,"height":25}]'::jsonb, 'approved', 'Approved for processing.', v_user_id, '2026-05-19 14:20:00+07'),
    ('a0000000-0000-0000-0000-000000000006', 91, 'Jet black, glossy surface', '[]'::jsonb, false, 'Approve — export grade peppercorns', 'Uniform size distribution. High oil content indicated by sheen.', '[{"label":"uniform grade","x":8,"y":10,"width":50,"height":50},{"label":"oil sheen","x":60,"y":40,"width":32,"height":35}]'::jsonb, 'approved', 'Export grade confirmed.', v_user_id, '2026-05-20 09:00:00+07'),
    ('a0000000-0000-0000-0000-000000000007', 74, 'Green pods, some browning', '["pod browning","split pods"]'::jsonb, false, 'Conditional — sort before use', 'About 15% of pods show browning. Recommend manual sorting.', '[{"label":"good pods","x":5,"y":10,"width":45,"height":55},{"label":"brown pods","x":55,"y":15,"width":35,"height":40}]'::jsonb, NULL, NULL, v_user_id, '2026-05-21 10:30:00+07'),
    ('a0000000-0000-0000-0000-000000000009', 88, 'Dark brown, intact star shape', '[]'::jsonb, false, 'Approve — well preserved', 'Stars mostly intact. Strong anise aroma. Properly dried.', '[{"label":"intact stars","x":10,"y":8,"width":48,"height":55},{"label":"aroma check","x":60,"y":45,"width":28,"height":30}]'::jsonb, 'approved', 'Good quality.', v_user_id, '2026-05-23 13:00:00+07'),
    ('a0000000-0000-0000-0000-000000000010', 71, 'Dark brown, slightly dry', '["surface cracking"]'::jsonb, false, 'Conditional — humidity control needed', 'Some beans show surface drying. Store in controlled humidity immediately.', '[{"label":"dry section","x":10,"y":20,"width":40,"height":35},{"label":"cracking","x":55,"y":45,"width":30,"height":30}]'::jsonb, NULL, NULL, v_user_id, '2026-05-24 15:00:00+07');

  -- Lot Images (using Unsplash spice photos)
  INSERT INTO public.lot_images (lot_id, storage_url, uploaded_by) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80', v_user_id),
    ('a0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80', v_user_id),
    ('a0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800&q=80', v_user_id),
    ('a0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80', v_user_id),
    ('a0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1509741102003-ca64bfe5f069?w=800&q=80', v_user_id),
    ('a0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1599909533601-aa1c31215e44?w=800&q=80', v_user_id),
    ('a0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&q=80', v_user_id),
    ('a0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80', v_user_id),
    ('a0000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&q=80', v_user_id),
    ('a0000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=800&q=80', v_user_id);

  -- Batch Events
  INSERT INTO public.batch_events (lot_id, event_type, description, actor_id, actor_name, created_at) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'lot_created', 'Lot received from Sima Farmer Collective.', v_user_id, 'System', '2026-05-15 08:00:00+07'),
    ('a0000000-0000-0000-0000-000000000001', 'qc_graded', 'AI QC completed. Score: 92/100.', v_user_id, 'AI Engine', '2026-05-15 09:30:00+07'),
    ('a0000000-0000-0000-0000-000000000001', 'human_approved', 'Lot approved by operator.', v_user_id, 'Operator', '2026-05-15 10:00:00+07'),
    ('a0000000-0000-0000-0000-000000000001', 'zone_assigned', 'Assigned to Zone A — Dry Storage.', v_user_id, 'Operator', '2026-05-15 10:15:00+07'),
    ('a0000000-0000-0000-0000-000000000002', 'lot_created', 'Lot received from Nusantara Spice Co.', v_user_id, 'System', '2026-05-16 08:00:00+07'),
    ('a0000000-0000-0000-0000-000000000002', 'qc_graded', 'AI QC completed. Score: 68/100. Moisture alert.', v_user_id, 'AI Engine', '2026-05-16 10:00:00+07'),
    ('a0000000-0000-0000-0000-000000000003', 'lot_created', 'Lot received from Java Harvest Partners.', v_user_id, 'System', '2026-05-17 08:00:00+07'),
    ('a0000000-0000-0000-0000-000000000003', 'qc_graded', 'AI QC completed. Score: 85/100.', v_user_id, 'AI Engine', '2026-05-17 11:15:00+07'),
    ('a0000000-0000-0000-0000-000000000003', 'human_approved', 'Lot approved.', v_user_id, 'Operator', '2026-05-17 11:45:00+07'),
    ('a0000000-0000-0000-0000-000000000004', 'lot_created', 'Lot received from Sima Farmer Collective.', v_user_id, 'System', '2026-05-18 07:30:00+07'),
    ('a0000000-0000-0000-0000-000000000004', 'qc_graded', 'AI QC completed. Score: 35/100. Contamination detected.', v_user_id, 'AI Engine', '2026-05-18 08:45:00+07'),
    ('a0000000-0000-0000-0000-000000000004', 'human_rejected', 'Lot rejected due to mold and insect damage.', v_user_id, 'Operator', '2026-05-18 09:00:00+07'),
    ('a0000000-0000-0000-0000-000000000005', 'lot_created', 'Lot received from Nusantara Spice Co.', v_user_id, 'System', '2026-05-19 12:00:00+07'),
    ('a0000000-0000-0000-0000-000000000005', 'qc_graded', 'AI QC completed. Score: 79/100.', v_user_id, 'AI Engine', '2026-05-19 14:20:00+07'),
    ('a0000000-0000-0000-0000-000000000005', 'human_approved', 'Approved for extraction.', v_user_id, 'Operator', '2026-05-19 14:45:00+07'),
    ('a0000000-0000-0000-0000-000000000006', 'lot_created', 'Lot received from Java Harvest Partners.', v_user_id, 'System', '2026-05-20 07:00:00+07'),
    ('a0000000-0000-0000-0000-000000000006', 'qc_graded', 'AI QC completed. Score: 91/100. Export grade.', v_user_id, 'AI Engine', '2026-05-20 09:00:00+07'),
    ('a0000000-0000-0000-0000-000000000006', 'human_approved', 'Export grade confirmed.', v_user_id, 'Operator', '2026-05-20 09:30:00+07'),
    ('a0000000-0000-0000-0000-000000000007', 'lot_created', 'Lot received from Sima Farmer Collective.', v_user_id, 'System', '2026-05-21 09:00:00+07'),
    ('a0000000-0000-0000-0000-000000000007', 'qc_graded', 'AI QC completed. Score: 74/100. Sorting recommended.', v_user_id, 'AI Engine', '2026-05-21 10:30:00+07'),
    ('a0000000-0000-0000-0000-000000000008', 'lot_created', 'Lot in transit from Nusantara Spice Co.', v_user_id, 'System', '2026-05-22 06:00:00+07'),
    ('a0000000-0000-0000-0000-000000000009', 'lot_created', 'Lot received from Java Harvest Partners.', v_user_id, 'System', '2026-05-23 11:00:00+07'),
    ('a0000000-0000-0000-0000-000000000009', 'qc_graded', 'AI QC completed. Score: 88/100.', v_user_id, 'AI Engine', '2026-05-23 13:00:00+07'),
    ('a0000000-0000-0000-0000-000000000009', 'human_approved', 'Good quality approved.', v_user_id, 'Operator', '2026-05-23 13:30:00+07'),
    ('a0000000-0000-0000-0000-000000000010', 'lot_created', 'Lot received from Sima Farmer Collective.', v_user_id, 'System', '2026-05-24 14:00:00+07'),
    ('a0000000-0000-0000-0000-000000000010', 'qc_graded', 'AI QC completed. Score: 71/100. Humidity control needed.', v_user_id, 'AI Engine', '2026-05-24 15:00:00+07');

  -- Alerts
  INSERT INTO public.alerts (lot_id, alert_type, severity, title, description, resolved) VALUES
    ('a0000000-0000-0000-0000-000000000002', 'high_rejection_risk', 'high', 'High Rejection Risk', 'LOT-2026-102 scored 68 — moisture detected. Awaiting human decision.', false),
    ('a0000000-0000-0000-0000-000000000004', 'supplier_quality_declining', 'medium', 'Supplier Quality Issue', 'Sima Farmer Collective clove batch rejected. Score: 35/100.', false),
    ('a0000000-0000-0000-0000-000000000007', 'qc_delay', 'low', 'QC Decision Pending', 'LOT-2026-107 awaiting human decision for 7+ days.', false),
    ('a0000000-0000-0000-0000-000000000010', 'qc_delay', 'low', 'QC Decision Pending', 'LOT-2026-110 vanilla beans need humidity control decision.', false);

END $$;
