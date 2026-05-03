create extension if not exists pgcrypto;

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = uid and is_admin = true
  );
$$;

create or replace function public.protect_profile_admin_flag()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    new.updated_at := now();
    return new;
  end if;
  if tg_op = 'INSERT' and not public.is_admin(auth.uid()) then
    new.is_admin := false;
  elsif tg_op = 'UPDATE' and old.is_admin is distinct from new.is_admin and not public.is_admin(auth.uid()) then
    new.is_admin := old.is_admin;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists protect_profile_admin_flag on profiles;
create trigger protect_profile_admin_flag
before insert or update on profiles
for each row execute function public.protect_profile_admin_flag();

create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  icon text not null default '🏅',
  label text not null,
  description text,
  metric text not null default 'total_entries',
  target_count integer not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  activity_type text not null,
  activity_label text not null,
  date text not null,
  duration_seconds integer not null default 0,
  distance_miles real not null default 0,
  pace text,
  path jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table badges enable row level security;
alter table activities enable row level security;

drop policy if exists "profiles_own_select" on profiles;
drop policy if exists "profiles_own_insert" on profiles;
drop policy if exists "profiles_own_update" on profiles;
drop policy if exists "profiles_admin_select" on profiles;
create policy "profiles_own_select" on profiles for select using (auth.uid() = user_id);
create policy "profiles_admin_select" on profiles for select using (public.is_admin(auth.uid()));
create policy "profiles_own_insert" on profiles for insert with check (auth.uid() = user_id);
create policy "profiles_own_update" on profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "badges_public_read" on badges;
drop policy if exists "badges_admin_insert" on badges;
drop policy if exists "badges_admin_update" on badges;
drop policy if exists "badges_admin_delete" on badges;
create policy "badges_public_read" on badges for select using (active = true or public.is_admin(auth.uid()));
create policy "badges_admin_insert" on badges for insert with check (public.is_admin(auth.uid()));
create policy "badges_admin_update" on badges for update using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "badges_admin_delete" on badges for delete using (public.is_admin(auth.uid()));

drop policy if exists "activities_own" on activities;
create policy "activities_own" on activities for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
