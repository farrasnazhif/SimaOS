-- Seed lot_images with public spice images for demo lots
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No auth user found, skipping image seed';
    RETURN;
  END IF;

  INSERT INTO public.lot_images (lot_id, storage_url, uploaded_by) VALUES
    ('b1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80', v_user_id),
    ('b1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80', v_user_id),
    ('b1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', v_user_id)
  ON CONFLICT DO NOTHING;

  -- Seed ai_detections for existing inspections
  UPDATE public.qc_inspections
  SET ai_detections = '[{"label": "good region", "x": 10, "y": 12, "width": 45, "height": 55}, {"label": "color sample", "x": 55, "y": 40, "width": 30, "height": 35}]'::jsonb
  WHERE lot_id = 'b1000000-0000-0000-0000-000000000001';

  UPDATE public.qc_inspections
  SET ai_detections = '[{"label": "surface moisture", "x": 8, "y": 15, "width": 50, "height": 50}, {"label": "discoloration", "x": 60, "y": 55, "width": 30, "height": 30}]'::jsonb
  WHERE lot_id = 'b1000000-0000-0000-0000-000000000002';

  UPDATE public.qc_inspections
  SET ai_detections = '[{"label": "browning", "x": 5, "y": 10, "width": 40, "height": 45}, {"label": "possible mold", "x": 50, "y": 50, "width": 35, "height": 35}]'::jsonb
  WHERE lot_id = 'b1000000-0000-0000-0000-000000000003';

END $$;
