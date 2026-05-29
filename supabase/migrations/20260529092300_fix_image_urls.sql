-- Update lot images with verified working URLs
UPDATE public.lot_images SET storage_url = 'https://images.pexels.com/photos/1437587/pexels-photo-1437587.jpeg?auto=compress&w=800'
WHERE lot_id = (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-001');

UPDATE public.lot_images SET storage_url = 'https://images.pexels.com/photos/4198370/pexels-photo-4198370.jpeg?auto=compress&w=800'
WHERE lot_id = (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-002');

UPDATE public.lot_images SET storage_url = 'https://images.pexels.com/photos/6157052/pexels-photo-6157052.jpeg?auto=compress&w=800'
WHERE lot_id = (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-003');

UPDATE public.lot_images SET storage_url = 'https://images.pexels.com/photos/5765828/pexels-photo-5765828.jpeg?auto=compress&w=800'
WHERE lot_id = (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-004');

UPDATE public.lot_images SET storage_url = 'https://images.pexels.com/photos/5765741/pexels-photo-5765741.jpeg?auto=compress&w=800'
WHERE lot_id = (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-005');

UPDATE public.lot_images SET storage_url = 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&w=800'
WHERE lot_id = (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-006');

UPDATE public.lot_images SET storage_url = 'https://images.pexels.com/photos/1437587/pexels-photo-1437587.jpeg?auto=compress&w=800'
WHERE lot_id = (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-007');

UPDATE public.lot_images SET storage_url = 'https://images.pexels.com/photos/4198370/pexels-photo-4198370.jpeg?auto=compress&w=800'
WHERE lot_id = (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-008');

UPDATE public.lot_images SET storage_url = 'https://images.pexels.com/photos/5765741/pexels-photo-5765741.jpeg?auto=compress&w=800'
WHERE lot_id = (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-009');

UPDATE public.lot_images SET storage_url = 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&w=800'
WHERE lot_id = (SELECT id FROM public.lots WHERE lot_number = 'LOT-2026-010');
