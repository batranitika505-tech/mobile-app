-- ==============================================================================
-- JalRakshak: Groundwater Conservation Educational Application
-- Migration: Milestone 3.3 — Secure Leaderboard Infrastructure
-- Tables: scenario_answer_keys, verified_scores, leaderboard_standings
-- Functions: submit_verified_scenario, get_leaderboard, get_my_leaderboard_rank
-- ==============================================================================

-- Schema hardening: prevent untrusted roles from creating objects in public schema
revoke create on schema public from public, anon, authenticated;

-- ------------------------------------------------------------------------------
-- 1. SCENARIO ANSWER KEYS (Protected Canonical Rubric)
-- ------------------------------------------------------------------------------
create table if not exists public.scenario_answer_keys (
  scenario_id text not null,
  question_id text not null,
  choice_id text not null,
  module_id text not null,
  outcome text not null check (outcome in ('sustainable', 'partially_sustainable', 'unsustainable')),
  xp integer not null check (xp in (0, 40, 100)),
  coins integer not null check (coins in (0, 4, 10)),
  primary key (scenario_id, question_id, choice_id),
  constraint chk_scenario_answer_keys_scoring check (
    (outcome = 'sustainable' and xp = 100 and coins = 10) or
    (outcome = 'partially_sustainable' and xp = 40 and coins = 4) or
    (outcome = 'unsustainable' and xp = 0 and coins = 0)
  )
);

-- Seed all 144 choices across 48 questions (16 scenarios, 4 modules)
insert into public.scenario_answer_keys (scenario_id, question_id, choice_id, module_id, outcome, xp, coins) values
  ('drought_1', 'd1_q1', 'd1_q1_c1', 'drought', 'sustainable', 100, 10),
  ('drought_1', 'd1_q1', 'd1_q1_c2', 'drought', 'partially_sustainable', 40, 4),
  ('drought_1', 'd1_q1', 'd1_q1_c3', 'drought', 'unsustainable', 0, 0),
  ('drought_1', 'd1_q2', 'd1_q2_c1', 'drought', 'sustainable', 100, 10),
  ('drought_1', 'd1_q2', 'd1_q2_c2', 'drought', 'partially_sustainable', 40, 4),
  ('drought_1', 'd1_q2', 'd1_q2_c3', 'drought', 'unsustainable', 0, 0),
  ('drought_1', 'd1_q3', 'd1_q3_c1', 'drought', 'sustainable', 100, 10),
  ('drought_1', 'd1_q3', 'd1_q3_c2', 'drought', 'unsustainable', 0, 0),
  ('drought_1', 'd1_q3', 'd1_q3_c3', 'drought', 'partially_sustainable', 40, 4),
  ('drought_2', 'd2_q1', 'd2_q1_c1', 'drought', 'sustainable', 100, 10),
  ('drought_2', 'd2_q1', 'd2_q1_c2', 'drought', 'unsustainable', 0, 0),
  ('drought_2', 'd2_q1', 'd2_q1_c3', 'drought', 'partially_sustainable', 40, 4),
  ('drought_2', 'd2_q2', 'd2_q2_c1', 'drought', 'sustainable', 100, 10),
  ('drought_2', 'd2_q2', 'd2_q2_c2', 'drought', 'partially_sustainable', 40, 4),
  ('drought_2', 'd2_q2', 'd2_q2_c3', 'drought', 'unsustainable', 0, 0),
  ('drought_2', 'd2_q3', 'd2_q3_c1', 'drought', 'sustainable', 100, 10),
  ('drought_2', 'd2_q3', 'd2_q3_c2', 'drought', 'unsustainable', 0, 0),
  ('drought_2', 'd2_q3', 'd2_q3_c3', 'drought', 'partially_sustainable', 40, 4),
  ('drought_3', 'd3_q1', 'd3_q1_c1', 'drought', 'sustainable', 100, 10),
  ('drought_3', 'd3_q1', 'd3_q1_c2', 'drought', 'unsustainable', 0, 0),
  ('drought_3', 'd3_q1', 'd3_q1_c3', 'drought', 'partially_sustainable', 40, 4),
  ('drought_3', 'd3_q2', 'd3_q2_c1', 'drought', 'sustainable', 100, 10),
  ('drought_3', 'd3_q2', 'd3_q2_c2', 'drought', 'unsustainable', 0, 0),
  ('drought_3', 'd3_q2', 'd3_q2_c3', 'drought', 'partially_sustainable', 40, 4),
  ('drought_3', 'd3_q3', 'd3_q3_c1', 'drought', 'sustainable', 100, 10),
  ('drought_3', 'd3_q3', 'd3_q3_c2', 'drought', 'partially_sustainable', 40, 4),
  ('drought_3', 'd3_q3', 'd3_q3_c3', 'drought', 'unsustainable', 0, 0),
  ('drought_4', 'd4_q1', 'd4_q1_c1', 'drought', 'sustainable', 100, 10),
  ('drought_4', 'd4_q1', 'd4_q1_c2', 'drought', 'partially_sustainable', 40, 4),
  ('drought_4', 'd4_q1', 'd4_q1_c3', 'drought', 'unsustainable', 0, 0),
  ('drought_4', 'd4_q2', 'd4_q2_c1', 'drought', 'sustainable', 100, 10),
  ('drought_4', 'd4_q2', 'd4_q2_c2', 'drought', 'unsustainable', 0, 0),
  ('drought_4', 'd4_q2', 'd4_q2_c3', 'drought', 'partially_sustainable', 40, 4),
  ('drought_4', 'd4_q3', 'd4_q3_c1', 'drought', 'sustainable', 100, 10),
  ('drought_4', 'd4_q3', 'd4_q3_c2', 'drought', 'unsustainable', 0, 0),
  ('drought_4', 'd4_q3', 'd4_q3_c3', 'drought', 'partially_sustainable', 40, 4),
  ('rainfall_1', 'r1_q1', 'r1_q1_c1', 'rainfall', 'sustainable', 100, 10),
  ('rainfall_1', 'r1_q1', 'r1_q1_c2', 'rainfall', 'unsustainable', 0, 0),
  ('rainfall_1', 'r1_q1', 'r1_q1_c3', 'rainfall', 'partially_sustainable', 40, 4),
  ('rainfall_1', 'r1_q2', 'r1_q2_c1', 'rainfall', 'sustainable', 100, 10),
  ('rainfall_1', 'r1_q2', 'r1_q2_c2', 'rainfall', 'unsustainable', 0, 0),
  ('rainfall_1', 'r1_q2', 'r1_q2_c3', 'rainfall', 'partially_sustainable', 40, 4),
  ('rainfall_1', 'r1_q3', 'r1_q3_c1', 'rainfall', 'sustainable', 100, 10),
  ('rainfall_1', 'r1_q3', 'r1_q3_c2', 'rainfall', 'partially_sustainable', 40, 4),
  ('rainfall_1', 'r1_q3', 'r1_q3_c3', 'rainfall', 'unsustainable', 0, 0),
  ('rainfall_2', 'r2_q1', 'r2_q1_c1', 'rainfall', 'sustainable', 100, 10),
  ('rainfall_2', 'r2_q1', 'r2_q1_c2', 'rainfall', 'partially_sustainable', 40, 4),
  ('rainfall_2', 'r2_q1', 'r2_q1_c3', 'rainfall', 'unsustainable', 0, 0),
  ('rainfall_2', 'r2_q2', 'r2_q2_c1', 'rainfall', 'sustainable', 100, 10),
  ('rainfall_2', 'r2_q2', 'r2_q2_c2', 'rainfall', 'unsustainable', 0, 0),
  ('rainfall_2', 'r2_q2', 'r2_q2_c3', 'rainfall', 'partially_sustainable', 40, 4),
  ('rainfall_2', 'r2_q3', 'r2_q3_c1', 'rainfall', 'sustainable', 100, 10),
  ('rainfall_2', 'r2_q3', 'r2_q3_c2', 'rainfall', 'unsustainable', 0, 0),
  ('rainfall_2', 'r2_q3', 'r2_q3_c3', 'rainfall', 'partially_sustainable', 40, 4),
  ('rainfall_3', 'r3_q1', 'r3_q1_c1', 'rainfall', 'sustainable', 100, 10),
  ('rainfall_3', 'r3_q1', 'r3_q1_c2', 'rainfall', 'unsustainable', 0, 0),
  ('rainfall_3', 'r3_q1', 'r3_q1_c3', 'rainfall', 'partially_sustainable', 40, 4),
  ('rainfall_3', 'r3_q2', 'r3_q2_c1', 'rainfall', 'sustainable', 100, 10),
  ('rainfall_3', 'r3_q2', 'r3_q2_c2', 'rainfall', 'unsustainable', 0, 0),
  ('rainfall_3', 'r3_q2', 'r3_q2_c3', 'rainfall', 'partially_sustainable', 40, 4),
  ('rainfall_3', 'r3_q3', 'r3_q3_c1', 'rainfall', 'sustainable', 100, 10),
  ('rainfall_3', 'r3_q3', 'r3_q3_c2', 'rainfall', 'unsustainable', 0, 0),
  ('rainfall_3', 'r3_q3', 'r3_q3_c3', 'rainfall', 'partially_sustainable', 40, 4),
  ('rainfall_4', 'r4_q1', 'r4_q1_c1', 'rainfall', 'sustainable', 100, 10),
  ('rainfall_4', 'r4_q1', 'r4_q1_c2', 'rainfall', 'unsustainable', 0, 0),
  ('rainfall_4', 'r4_q1', 'r4_q1_c3', 'rainfall', 'partially_sustainable', 40, 4),
  ('rainfall_4', 'r4_q2', 'r4_q2_c1', 'rainfall', 'sustainable', 100, 10),
  ('rainfall_4', 'r4_q2', 'r4_q2_c2', 'rainfall', 'unsustainable', 0, 0),
  ('rainfall_4', 'r4_q2', 'r4_q2_c3', 'rainfall', 'partially_sustainable', 40, 4),
  ('rainfall_4', 'r4_q3', 'r4_q3_c1', 'rainfall', 'sustainable', 100, 10),
  ('rainfall_4', 'r4_q3', 'r4_q3_c2', 'rainfall', 'unsustainable', 0, 0),
  ('rainfall_4', 'r4_q3', 'r4_q3_c3', 'rainfall', 'partially_sustainable', 40, 4),
  ('contamination_1', 'c1_q1', 'c1_q1_c1', 'contamination', 'sustainable', 100, 10),
  ('contamination_1', 'c1_q1', 'c1_q1_c2', 'contamination', 'unsustainable', 0, 0),
  ('contamination_1', 'c1_q1', 'c1_q1_c3', 'contamination', 'partially_sustainable', 40, 4),
  ('contamination_1', 'c1_q2', 'c1_q2_c1', 'contamination', 'sustainable', 100, 10),
  ('contamination_1', 'c1_q2', 'c1_q2_c2', 'contamination', 'unsustainable', 0, 0),
  ('contamination_1', 'c1_q2', 'c1_q2_c3', 'contamination', 'partially_sustainable', 40, 4),
  ('contamination_1', 'c1_q3', 'c1_q3_c1', 'contamination', 'sustainable', 100, 10),
  ('contamination_1', 'c1_q3', 'c1_q3_c2', 'contamination', 'unsustainable', 0, 0),
  ('contamination_1', 'c1_q3', 'c1_q3_c3', 'contamination', 'partially_sustainable', 40, 4),
  ('contamination_2', 'c2_q1', 'c2_q1_c1', 'contamination', 'sustainable', 100, 10),
  ('contamination_2', 'c2_q1', 'c2_q1_c2', 'contamination', 'unsustainable', 0, 0),
  ('contamination_2', 'c2_q1', 'c2_q1_c3', 'contamination', 'partially_sustainable', 40, 4),
  ('contamination_2', 'c2_q2', 'c2_q2_c1', 'contamination', 'sustainable', 100, 10),
  ('contamination_2', 'c2_q2', 'c2_q2_c2', 'contamination', 'unsustainable', 0, 0),
  ('contamination_2', 'c2_q2', 'c2_q2_c3', 'contamination', 'partially_sustainable', 40, 4),
  ('contamination_2', 'c2_q3', 'c2_q3_c1', 'contamination', 'sustainable', 100, 10),
  ('contamination_2', 'c2_q3', 'c2_q3_c2', 'contamination', 'unsustainable', 0, 0),
  ('contamination_2', 'c2_q3', 'c2_q3_c3', 'contamination', 'unsustainable', 0, 0),
  ('contamination_3', 'c3_q1', 'c3_q1_c1', 'contamination', 'sustainable', 100, 10),
  ('contamination_3', 'c3_q1', 'c3_q1_c2', 'contamination', 'unsustainable', 0, 0),
  ('contamination_3', 'c3_q1', 'c3_q1_c3', 'contamination', 'unsustainable', 0, 0),
  ('contamination_3', 'c3_q2', 'c3_q2_c1', 'contamination', 'sustainable', 100, 10),
  ('contamination_3', 'c3_q2', 'c3_q2_c2', 'contamination', 'unsustainable', 0, 0),
  ('contamination_3', 'c3_q2', 'c3_q2_c3', 'contamination', 'unsustainable', 0, 0),
  ('contamination_3', 'c3_q3', 'c3_q3_c1', 'contamination', 'sustainable', 100, 10),
  ('contamination_3', 'c3_q3', 'c3_q3_c2', 'contamination', 'unsustainable', 0, 0),
  ('contamination_3', 'c3_q3', 'c3_q3_c3', 'contamination', 'unsustainable', 0, 0),
  ('contamination_4', 'c4_q1', 'c4_q1_c1', 'contamination', 'sustainable', 100, 10),
  ('contamination_4', 'c4_q1', 'c4_q1_c2', 'contamination', 'unsustainable', 0, 0),
  ('contamination_4', 'c4_q1', 'c4_q1_c3', 'contamination', 'unsustainable', 0, 0),
  ('contamination_4', 'c4_q2', 'c4_q2_c1', 'contamination', 'sustainable', 100, 10),
  ('contamination_4', 'c4_q2', 'c4_q2_c2', 'contamination', 'unsustainable', 0, 0),
  ('contamination_4', 'c4_q2', 'c4_q2_c3', 'contamination', 'unsustainable', 0, 0),
  ('contamination_4', 'c4_q3', 'c4_q3_c1', 'contamination', 'sustainable', 100, 10),
  ('contamination_4', 'c4_q3', 'c4_q3_c2', 'contamination', 'partially_sustainable', 40, 4),
  ('contamination_4', 'c4_q3', 'c4_q3_c3', 'contamination', 'unsustainable', 0, 0),
  ('agriculture_1', 'a1_q1', 'a1_q1_c1', 'agriculture', 'sustainable', 100, 10),
  ('agriculture_1', 'a1_q1', 'a1_q1_c2', 'agriculture', 'partially_sustainable', 40, 4),
  ('agriculture_1', 'a1_q1', 'a1_q1_c3', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_1', 'a1_q2', 'a1_q2_c1', 'agriculture', 'sustainable', 100, 10),
  ('agriculture_1', 'a1_q2', 'a1_q2_c2', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_1', 'a1_q2', 'a1_q2_c3', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_1', 'a1_q3', 'a1_q3_c1', 'agriculture', 'sustainable', 100, 10),
  ('agriculture_1', 'a1_q3', 'a1_q3_c2', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_1', 'a1_q3', 'a1_q3_c3', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_2', 'a2_q1', 'a2_q1_c1', 'agriculture', 'sustainable', 100, 10),
  ('agriculture_2', 'a2_q1', 'a2_q1_c2', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_2', 'a2_q1', 'a2_q1_c3', 'agriculture', 'partially_sustainable', 40, 4),
  ('agriculture_2', 'a2_q2', 'a2_q2_c1', 'agriculture', 'sustainable', 100, 10),
  ('agriculture_2', 'a2_q2', 'a2_q2_c2', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_2', 'a2_q2', 'a2_q2_c3', 'agriculture', 'partially_sustainable', 40, 4),
  ('agriculture_2', 'a2_q3', 'a2_q3_c1', 'agriculture', 'sustainable', 100, 10),
  ('agriculture_2', 'a2_q3', 'a2_q3_c2', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_2', 'a2_q3', 'a2_q3_c3', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_3', 'a3_q1', 'a3_q1_c1', 'agriculture', 'sustainable', 100, 10),
  ('agriculture_3', 'a3_q1', 'a3_q1_c2', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_3', 'a3_q1', 'a3_q1_c3', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_3', 'a3_q2', 'a3_q2_c1', 'agriculture', 'sustainable', 100, 10),
  ('agriculture_3', 'a3_q2', 'a3_q2_c2', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_3', 'a3_q2', 'a3_q2_c3', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_3', 'a3_q3', 'a3_q3_c1', 'agriculture', 'sustainable', 100, 10),
  ('agriculture_3', 'a3_q3', 'a3_q3_c2', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_3', 'a3_q3', 'a3_q3_c3', 'agriculture', 'partially_sustainable', 40, 4),
  ('agriculture_4', 'a4_q1', 'a4_q1_c1', 'agriculture', 'sustainable', 100, 10),
  ('agriculture_4', 'a4_q1', 'a4_q1_c2', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_4', 'a4_q1', 'a4_q1_c3', 'agriculture', 'partially_sustainable', 40, 4),
  ('agriculture_4', 'a4_q2', 'a4_q2_c1', 'agriculture', 'sustainable', 100, 10),
  ('agriculture_4', 'a4_q2', 'a4_q2_c2', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_4', 'a4_q2', 'a4_q2_c3', 'agriculture', 'partially_sustainable', 40, 4),
  ('agriculture_4', 'a4_q3', 'a4_q3_c1', 'agriculture', 'sustainable', 100, 10),
  ('agriculture_4', 'a4_q3', 'a4_q3_c2', 'agriculture', 'unsustainable', 0, 0),
  ('agriculture_4', 'a4_q3', 'a4_q3_c3', 'agriculture', 'unsustainable', 0, 0)
on conflict (scenario_id, question_id, choice_id) do update set
  module_id = excluded.module_id,
  outcome = excluded.outcome,
  xp = excluded.xp,
  coins = excluded.coins;

-- Enable RLS and lock down direct client access
alter table public.scenario_answer_keys enable row level security;
revoke all on table public.scenario_answer_keys from public, anon, authenticated;
-- No RLS policies defined: default-deny for all roles except table owner (postgres)

-- ------------------------------------------------------------------------------
-- 2. VERIFIED SCORES (Authoritative Completion Audit Log)
-- ------------------------------------------------------------------------------
create table if not exists public.verified_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id text not null,
  module_id text not null,
  earned_xp integer not null check (earned_xp >= 50 and earned_xp <= 350),
  earned_coins integer not null check (earned_coins >= 5 and earned_coins <= 35),
  submitted_answers jsonb not null,
  completed_at timestamptz default timezone('utc'::text, now()) not null,
  constraint uq_verified_scores_user_scenario unique (user_id, scenario_id)
);

create index if not exists idx_verified_scores_user on public.verified_scores(user_id);
create index if not exists idx_verified_scores_scenario on public.verified_scores(scenario_id);

-- Enable RLS: Clients can only read their own scores; direct writes prohibited
alter table public.verified_scores enable row level security;
revoke all on table public.verified_scores from public, anon, authenticated;
grant select on table public.verified_scores to authenticated;

drop policy if exists "Users can view own verified scores" on public.verified_scores;
create policy "Users can view own verified scores"
  on public.verified_scores
  for select to authenticated
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 3. LEADERBOARD STANDINGS (Read-Optimized Competitive Standings)
-- ------------------------------------------------------------------------------
create table if not exists public.leaderboard_standings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  verified_xp integer not null default 0 check (verified_xp >= 0 and verified_xp <= 5600),
  verified_coins integer not null default 0 check (verified_coins >= 0 and verified_coins <= 560),
  completed_scenarios_count integer not null default 0 check (completed_scenarios_count >= 0 and completed_scenarios_count <= 16),
  last_earned_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_leaderboard_standings_ranking
  on public.leaderboard_standings (verified_xp desc, last_earned_at asc);
create index if not exists idx_leaderboard_standings_user
  on public.leaderboard_standings (user_id);

-- Enable RLS: Public can read leaderboard; direct writes prohibited
alter table public.leaderboard_standings enable row level security;
revoke all on table public.leaderboard_standings from public, anon, authenticated;
grant select on table public.leaderboard_standings to authenticated, anon;

drop policy if exists "Public view of leaderboard standings" on public.leaderboard_standings;
create policy "Public view of leaderboard standings"
  on public.leaderboard_standings
  for select
  using (true);

-- ------------------------------------------------------------------------------
-- 4. RPC: submit_verified_scenario
-- ------------------------------------------------------------------------------
create or replace function public.submit_verified_scenario(
  p_scenario_id text,
  p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_user_id uuid;
  v_module_id text;
  v_earned_xp integer := 0;
  v_earned_coins integer := 0;
  v_total_questions integer;
  v_submitted_keys_count integer;
  v_matched_questions integer := 0;
  v_key text;
  v_choice_id text;
  v_choice_xp integer;
  v_choice_coins integer;
  v_display_name text;
  v_avatar_url text;
  v_inserted_id uuid;
  v_new_total_xp integer;
begin
  -- A. Authentication Check
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  -- B. Strict JSON Structure Check
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Malformed answers payload: must be a JSON object' using errcode = '22023';
  end if;

  -- C. Validate Scenario Exists in Canonical Catalog
  select count(distinct question_id), min(module_id)
  into v_total_questions, v_module_id
  from public.scenario_answer_keys
  where scenario_id = p_scenario_id;

  if v_total_questions is null or v_total_questions = 0 then
    raise exception 'Scenario % not found in catalog', p_scenario_id using errcode = '22023';
  end if;

  -- D. Exact Key-Count Check (Rejects missing or unexpected keys)
  select count(*) into v_submitted_keys_count from jsonb_object_keys(p_answers);
  if v_submitted_keys_count <> v_total_questions then
    raise exception 'Invalid question count: expected %, received % keys',
      v_total_questions, v_submitted_keys_count using errcode = '22023';
  end if;

  -- E. Validate Each Question Key and Value Against Answer Keys
  for v_key in select jsonb_object_keys(p_answers) loop
    if jsonb_typeof(p_answers->v_key) <> 'string' then
      raise exception 'Malformed choice value for question %: must be a string', v_key using errcode = '22023';
    end if;

    v_choice_id := p_answers->>v_key;

    select xp, coins into v_choice_xp, v_choice_coins
    from public.scenario_answer_keys
    where scenario_id = p_scenario_id
      and question_id = v_key
      and choice_id = v_choice_id;

    if not found then
      raise exception 'Invalid question or choice ID: question %, choice %', v_key, v_choice_id using errcode = '22023';
    end if;

    v_earned_xp := v_earned_xp + v_choice_xp;
    v_earned_coins := v_earned_coins + v_choice_coins;
    v_matched_questions := v_matched_questions + 1;
  end loop;

  -- Add verified scenario completion bonus (+50 XP, +5 coins)
  v_earned_xp := v_earned_xp + 50;
  v_earned_coins := v_earned_coins + 5;

  -- F. Atomic Idempotent Insert into verified_scores
  insert into public.verified_scores (
    user_id, scenario_id, module_id, earned_xp, earned_coins, submitted_answers, completed_at
  ) values (
    v_user_id, p_scenario_id, v_module_id, v_earned_xp, v_earned_coins, p_answers, now()
  )
  on conflict (user_id, scenario_id) do nothing
  returning id into v_inserted_id;

  -- If no row was inserted, this scenario was previously completed
  if v_inserted_id is null then
    select coalesce(verified_xp, 0) into v_new_total_xp
    from public.leaderboard_standings
    where user_id = v_user_id;

    return jsonb_build_object(
      'status', 'already_completed',
      'is_first_completion', false,
      'scenario_id', p_scenario_id,
      'earned_xp', 0,
      'earned_coins', 0,
      'total_verified_xp', coalesce(v_new_total_xp, 0)
    );
  end if;

  -- G. Fetch Player's Public Display Name (Safe from PII)
  select
    coalesce(nullif(display_name, ''), nullif(full_name, ''), 'Guardian ' || substr(v_user_id::text, 1, 6)),
    avatar_url
  into v_display_name, v_avatar_url
  from public.profiles
  where id = v_user_id;

  if v_display_name is null then
    v_display_name := 'Guardian ' || substr(v_user_id::text, 1, 6);
  end if;

  -- H. Atomic UPSERT into leaderboard_standings (Rolls back if this fails)
  insert into public.leaderboard_standings (
    user_id, display_name, avatar_url, verified_xp, verified_coins, completed_scenarios_count, last_earned_at, updated_at
  ) values (
    v_user_id, v_display_name, v_avatar_url, v_earned_xp, v_earned_coins, 1, now(), now()
  )
  on conflict (user_id) do update set
    verified_xp = public.leaderboard_standings.verified_xp + excluded.verified_xp,
    verified_coins = public.leaderboard_standings.verified_coins + excluded.verified_coins,
    completed_scenarios_count = public.leaderboard_standings.completed_scenarios_count + 1,
    display_name = coalesce(excluded.display_name, public.leaderboard_standings.display_name),
    avatar_url = coalesce(excluded.avatar_url, public.leaderboard_standings.avatar_url),
    last_earned_at = now(),
    updated_at = now()
  returning verified_xp into v_new_total_xp;

  return jsonb_build_object(
    'status', 'success',
    'is_first_completion', true,
    'scenario_id', p_scenario_id,
    'earned_xp', v_earned_xp,
    'earned_coins', v_earned_coins,
    'total_verified_xp', v_new_total_xp
  );
end;
$$;

-- ------------------------------------------------------------------------------
-- 5. RPC: get_leaderboard
-- ------------------------------------------------------------------------------
create or replace function public.get_leaderboard(
  p_limit integer default 50,
  p_offset integer default 0
)
returns table (
  rank bigint,
  user_id uuid,
  display_name text,
  avatar_url text,
  verified_xp integer,
  completed_scenarios_count integer,
  tier text
)
language sql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
  select
    dense_rank() over (order by verified_xp desc) as rank,
    user_id,
    display_name,
    avatar_url,
    verified_xp,
    completed_scenarios_count,
    case
      when verified_xp >= 2000 then 'Jal Nayak'
      when verified_xp >= 1000 then 'Jal Rakshak'
      when verified_xp >= 400 then 'Jal Mitra'
      else 'Water Cadet'
    end as tier
  from public.leaderboard_standings
  order by rank asc, last_earned_at asc, user_id asc
  limit least(greatest(coalesce(p_limit, 50), 1), 100)
  offset greatest(coalesce(p_offset, 0), 0);
$$;

-- ------------------------------------------------------------------------------
-- 6. RPC: get_my_leaderboard_rank
-- ------------------------------------------------------------------------------
create or replace function public.get_my_leaderboard_rank()
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_user_id uuid;
  v_result jsonb;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return null;
  end if;

  with ranked as (
    select
      dense_rank() over (order by verified_xp desc) as rank,
      user_id,
      display_name,
      avatar_url,
      verified_xp,
      completed_scenarios_count,
      case
        when verified_xp >= 2000 then 'Jal Nayak'
        when verified_xp >= 1000 then 'Jal Rakshak'
        when verified_xp >= 400 then 'Jal Mitra'
        else 'Water Cadet'
      end as tier
    from public.leaderboard_standings
  )
  select to_jsonb(r) into v_result
  from ranked r
  where r.user_id = v_user_id;

  return v_result;
end;
$$;

-- ------------------------------------------------------------------------------
-- 7. FUNCTION PERMISSIONS
-- ------------------------------------------------------------------------------
revoke all on function public.submit_verified_scenario(text, jsonb) from public, anon, authenticated;
revoke all on function public.get_leaderboard(integer, integer) from public, anon, authenticated;
revoke all on function public.get_my_leaderboard_rank() from public, anon, authenticated;

grant execute on function public.submit_verified_scenario(text, jsonb) to authenticated;
grant execute on function public.get_leaderboard(integer, integer) to authenticated, anon;
grant execute on function public.get_my_leaderboard_rank() to authenticated;
