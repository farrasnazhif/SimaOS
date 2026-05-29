-- Use loremflickr for real material images (serves actual photos by keyword)
UPDATE public.lot_images SET storage_url = 'https://loremflickr.com/800/600/ginger,root'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-001');

UPDATE public.lot_images SET storage_url = 'https://loremflickr.com/800/600/turmeric,spice'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-002');

UPDATE public.lot_images SET storage_url = 'https://loremflickr.com/800/600/cinnamon,bark'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-003');

UPDATE public.lot_images SET storage_url = 'https://loremflickr.com/800/600/cloves,spice'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-004');

UPDATE public.lot_images SET storage_url = 'https://loremflickr.com/800/600/black,pepper'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-005');

UPDATE public.lot_images SET storage_url = 'https://loremflickr.com/800/600/nutmeg,seed'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-006');

UPDATE public.lot_images SET storage_url = 'https://loremflickr.com/800/600/ginger,fresh'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-007');

UPDATE public.lot_images SET storage_url = 'https://loremflickr.com/800/600/turmeric,root'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-008');

UPDATE public.lot_images SET storage_url = 'https://loremflickr.com/800/600/peppercorn,black'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-009');

UPDATE public.lot_images SET storage_url = 'https://loremflickr.com/800/600/nutmeg,whole'
WHERE lot_id IN (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-010');
