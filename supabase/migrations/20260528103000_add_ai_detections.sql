-- Add ai_detections column to store bounding box data from AI vision
alter table public.qc_inspections
  add column ai_detections jsonb;
