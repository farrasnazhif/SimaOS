-- suppliers
create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text not null unique,
  created_at timestamptz not null default now()
);

-- lots
create table public.lots (
  id uuid primary key default gen_random_uuid(),
  lot_number text not null unique,
  material_name text not null,
  material_type text not null,
  supplier_id uuid not null references public.suppliers(id),
  quantity_kg numeric not null check (quantity_kg > 0),
  arrival_date date not null,
  status text not null default 'in_qc',
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- qc_inspections
create table public.qc_inspections (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references public.lots(id),
  ai_quality_score numeric not null,
  ai_colour text,
  ai_defects text[],
  ai_foreign_matter boolean default false,
  ai_recommendation text,
  ai_notes text,
  inspected_by uuid not null references auth.users(id),
  inspected_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- batch_events
create table public.batch_events (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references public.lots(id),
  event_type text not null,
  description text,
  actor_id uuid not null references auth.users(id),
  actor_name text,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.suppliers enable row level security;
alter table public.lots enable row level security;
alter table public.qc_inspections enable row level security;
alter table public.batch_events enable row level security;

-- policies
create policy "Authenticated users can read suppliers"
  on public.suppliers for select to authenticated using (true);

create policy "Authenticated users can insert suppliers"
  on public.suppliers for insert to authenticated with check (true);

create policy "Authenticated users can read lots"
  on public.lots for select to authenticated using (true);

create policy "Users can insert their own lots"
  on public.lots for insert to authenticated with check (auth.uid() = created_by);

create policy "Authenticated users can read qc_inspections"
  on public.qc_inspections for select to authenticated using (true);

create policy "Users can insert their own qc_inspections"
  on public.qc_inspections for insert to authenticated with check (auth.uid() = inspected_by);

create policy "Authenticated users can read batch_events"
  on public.batch_events for select to authenticated using (true);

create policy "Users can insert their own batch_events"
  on public.batch_events for insert to authenticated with check (auth.uid() = actor_id);
