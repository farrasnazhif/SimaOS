-- Alter lots: add warehouse_zone and updated_at
alter table public.lots
  add column warehouse_zone text,
  add column updated_at timestamptz not null default now();

-- Alter qc_inspections: change ai_defects to jsonb, add human decision fields
alter table public.qc_inspections
  alter column ai_defects type jsonb using to_jsonb(ai_defects),
  add column human_decision text,
  add column human_notes text;

-- Allow authenticated users to update their own lots (for zone assignment, status changes)
create policy "Users can update their own lots"
  on public.lots for update to authenticated using (auth.uid() = created_by);

-- Allow authenticated users to update qc_inspections (for human decision)
create policy "Users can update their own qc_inspections"
  on public.qc_inspections for update to authenticated using (auth.uid() = inspected_by);

-- lot_images
create table public.lot_images (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references public.lots(id),
  storage_url text not null,
  uploaded_by uuid not null references auth.users(id),
  uploaded_at timestamptz not null default now()
);

alter table public.lot_images enable row level security;

create policy "Authenticated users can read lot_images"
  on public.lot_images for select to authenticated using (true);

create policy "Users can insert their own lot_images"
  on public.lot_images for insert to authenticated with check (auth.uid() = uploaded_by);

-- alerts
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid references public.lots(id),
  alert_type text not null,
  severity text not null,
  title text not null,
  description text,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.alerts enable row level security;

create policy "Authenticated users can read alerts"
  on public.alerts for select to authenticated using (true);

create policy "Authenticated users can insert alerts"
  on public.alerts for insert to authenticated with check (true);

create policy "Authenticated users can update alerts"
  on public.alerts for update to authenticated using (true);

-- knowledge_notes
create table public.knowledge_notes (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid references public.lots(id),
  material_name text,
  note_type text not null,
  content text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.knowledge_notes enable row level security;

create policy "Authenticated users can read knowledge_notes"
  on public.knowledge_notes for select to authenticated using (true);

create policy "Users can insert their own knowledge_notes"
  on public.knowledge_notes for insert to authenticated with check (auth.uid() = created_by);
