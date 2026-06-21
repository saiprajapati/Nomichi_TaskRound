-- Nomichi Trip Desk — initial schema
-- Run this in the Supabase SQL editor, or via `supabase db push`.

-- ─────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────
create type trip_status as enum ('open', 'closed');

create type group_type as enum ('solo', 'friends', 'couple', 'family');

create type lead_status as enum (
  'new',
  'contacted',
  'qualified',
  'vibe_check_sent',
  'confirmed',
  'not_a_fit'
);

-- ─────────────────────────────────────────────────────────────
-- Team members (maps 1:1 to a Supabase auth user)
-- A row is created automatically by a trigger when someone signs up,
-- so "assign an owner" always has a clean list to pick from.
-- ─────────────────────────────────────────────────────────────
create table public.team_members (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.team_members enable row level security;

create policy "team members can read all team members"
  on public.team_members for select
  to authenticated
  using (true);

-- Auto-create a team_members row whenever a new auth user signs up.
create function public.handle_new_team_member()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.team_members (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_team_member();

-- ─────────────────────────────────────────────────────────────
-- Trips — the CMS-like piece. Public can read open trips only.
-- ─────────────────────────────────────────────────────────────
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  price_inr_gst integer not null check (price_inr_gst >= 0), -- price including GST, in whole rupees
  total_seats integer not null check (total_seats > 0),
  status trip_status not null default 'open',
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trips_dates_check check (end_date >= start_date)
);

create index trips_status_idx on public.trips (status);
create index trips_start_date_idx on public.trips (start_date);

alter table public.trips enable row level security;

-- Public (anon) visitors can read only open trips.
create policy "anyone can read open trips"
  on public.trips for select
  to anon, authenticated
  using (status = 'open' or auth.role() = 'authenticated');

-- Only authenticated team members can write trips.
create policy "team can insert trips"
  on public.trips for insert
  to authenticated
  with check (true);

create policy "team can update trips"
  on public.trips for update
  to authenticated
  using (true)
  with check (true);

create policy "team can delete trips"
  on public.trips for delete
  to authenticated
  using (true);

-- keep updated_at fresh
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trips_set_updated_at
  before update on public.trips
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Leads — the heart of the mini-CRM.
-- Public (anon) can INSERT (submit an enquiry) but never read.
-- Authenticated team members can read / update everything for now;
-- owner-scoped RLS is a stretch goal layered on top later.
-- ─────────────────────────────────────────────────────────────
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  trip_id uuid references public.trips (id) on delete set null,
  group_type group_type not null,
  preferred_month text not null, -- free-form "January 2027" style string from a month picker
  trip_feeling text not null default '', -- "what are you hoping this trip feels like"
  status lead_status not null default 'new',
  owner_id uuid references public.team_members (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_status_idx on public.leads (status);
create index leads_trip_id_idx on public.leads (trip_id);
create index leads_owner_id_idx on public.leads (owner_id);
create index leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- Anyone (including anon visitors on the public form) can create a lead.
create policy "anyone can submit a lead"
  on public.leads for insert
  to anon, authenticated
  with check (true);

-- Only the team can read leads. (Stretch: scope to owner_id = auth.uid() OR owner_id is null.)
create policy "team can read leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "team can update leads"
  on public.leads for update
  to authenticated
  using (true)
  with check (true);

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Lead notes — timestamped call log / touchpoints against a lead.
-- ─────────────────────────────────────────────────────────────
create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  author_id uuid references public.team_members (id) on delete set null,
  body text not null,
  next_action text,
  created_at timestamptz not null default now()
);

create index lead_notes_lead_id_idx on public.lead_notes (lead_id, created_at desc);

alter table public.lead_notes enable row level security;

create policy "team can read lead notes"
  on public.lead_notes for select
  to authenticated
  using (true);

create policy "team can insert lead notes"
  on public.lead_notes for insert
  to authenticated
  with check (true);

-- ─────────────────────────────────────────────────────────────
-- Lead status history — powers the activity timeline (stretch).
-- ─────────────────────────────────────────────────────────────
create table public.lead_status_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  from_status lead_status,
  to_status lead_status not null,
  changed_by uuid references public.team_members (id) on delete set null,
  created_at timestamptz not null default now()
);

create index lead_status_events_lead_id_idx on public.lead_status_events (lead_id, created_at desc);

alter table public.lead_status_events enable row level security;

create policy "team can read lead status events"
  on public.lead_status_events for select
  to authenticated
  using (true);

create policy "team can insert lead status events"
  on public.lead_status_events for insert
  to authenticated
  with check (true);

-- Automatically log a status_events row whenever leads.status changes.
create function public.log_lead_status_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    insert into public.lead_status_events (lead_id, from_status, to_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create trigger leads_log_status_change
  after update on public.leads
  for each row execute procedure public.log_lead_status_change();

-- Log the initial "new" status on lead creation too.
create function public.log_lead_created()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.lead_status_events (lead_id, from_status, to_status, changed_by)
  values (new.id, null, new.status, auth.uid());
  return new;
end;
$$;

create trigger leads_log_created
  after insert on public.leads
  for each row execute procedure public.log_lead_created();
