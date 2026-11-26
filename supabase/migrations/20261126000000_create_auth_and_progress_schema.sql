-- ==============================================================================
-- JalRakshak: Groundwater Conservation Educational Application
-- Migration: Auth Profiles and Game Progress Schema
-- Milestone 2C: Supabase Authentication and Cloud Persistence
-- ==============================================================================

-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  display_name text,
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Profiles indexes
create index if not exists idx_profiles_id on public.profiles(id);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- 2. Trigger to automatically create a profile on new user registration
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (id, email, full_name, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(coalesce(new.email, 'Guardian'), '@', 1))
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    display_name = coalesce(excluded.display_name, profiles.display_name),
    updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Create game_progress table
create table if not exists public.game_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  total_xp integer not null default 0 check (total_xp >= 0),
  coins integer not null default 0 check (coins >= 0),
  completed_scenarios text[] not null default '{}',
  completed_modules text[] not null default '{}',
  scenario_records jsonb not null default '{}'::jsonb,
  achievements text[] not null default '{}',
  last_synced_at timestamptz default timezone('utc'::text, now()) not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Game progress indexes
create index if not exists idx_game_progress_user_id on public.game_progress(user_id);

-- Enable RLS for game_progress
alter table public.game_progress enable row level security;

-- Policies for game_progress
create policy "Users can view their own game progress"
  on public.game_progress
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own game progress"
  on public.game_progress
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own game progress"
  on public.game_progress
  for update
  using (auth.uid() = user_id);

