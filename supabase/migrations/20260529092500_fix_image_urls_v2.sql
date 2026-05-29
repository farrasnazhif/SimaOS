-- Fix image URLs to use Wikipedia Commons images matching each material type
-- Ginger Root
UPDATE public.lot_images SET storage_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Ginger_in_a_dish.jpg/800px-Ginger_in_a_dish.jpg'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number IN ('LOT-2026-001', 'LOT-2026-007'));

-- Turmeric
UPDATE public.lot_images SET storage_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Turmeric-powder.jpg/800px-Turmeric-powder.jpg'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number IN ('LOT-2026-002', 'LOT-2026-008'));

-- Cinnamon Bark
UPDATE public.lot_images SET storage_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Canelle_Liban.jpg/800px-Canelle_Liban.jpg'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-003');

-- Clove Buds
UPDATE public.lot_images SET storage_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Cloves.JPG/800px-Cloves.JPG'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-004');

-- Black Pepper
UPDATE public.lot_images SET storage_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Black_Pepper_%28Piper_nigrum%29_-_dried_fruit_aka_peppercorn.jpg/800px-Black_Pepper_%28Piper_nigrum%29_-_dried_fruit_aka_peppercorn.jpg'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number IN ('LOT-2026-005', 'LOT-2026-009'));

-- Nutmeg
UPDATE public.lot_images SET storage_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Nutmeg_-_Myristica_fragrans.jpg/800px-Nutmeg_-_Myristica_fragrans.jpg'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number IN ('LOT-2026-006', 'LOT-2026-010'));
