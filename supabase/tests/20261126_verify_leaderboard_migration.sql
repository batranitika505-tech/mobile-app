-- ==============================================================================
-- JalRakshak: Groundwater Conservation Educational Application
-- Verification Script: Milestone 3.3 — Secure Leaderboard Migration Verification
-- Target Migration: supabase/migrations/20261126000002_create_secure_leaderboard.sql
--
-- Safety Guarantee:
-- This script contains ONLY read-only introspection queries and assertions inside
-- a DO block. It performs NO schema modifications, data mutations, or deletions.
-- ==============================================================================

do $$
declare
  v_count integer;
  v_scenario_count integer;
  v_question_count integer;
  v_module_count integer;
  v_sustainable_count integer;
  v_partially_count integer;
  v_unsustainable_count integer;
  v_invalid_scoring integer;
  v_func_count integer;
  v_func_record record;
  v_policy_record record;
  v_has_constraint boolean;
  v_rls_enabled boolean;
  v_relforce boolean;
  v_policy_count integer;
  v_public_acl_count integer;
begin
  raise notice '============================================================';
  raise notice 'JalRakshak Milestone 3.3: Verifying Secure Leaderboard Migration';
  raise notice '============================================================';

  -- --------------------------------------------------------------------------
  -- 1. VERIFY TABLE EXISTENCE
  -- --------------------------------------------------------------------------
  if not exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'scenario_answer_keys') then
    raise exception 'Assertion failed: Table public.scenario_answer_keys does not exist!';
  end if;

  if not exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'verified_scores') then
    raise exception 'Assertion failed: Table public.verified_scores does not exist!';
  end if;

  if not exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'leaderboard_standings') then
    raise exception 'Assertion failed: Table public.leaderboard_standings does not exist!';
  end if;
  raise notice 'PASS [1/7]: All three required tables exist in public schema.';

  -- --------------------------------------------------------------------------
  -- 2. VERIFY SCENARIO_ANSWER_KEYS SEED DATA & INTEGRITY
  -- --------------------------------------------------------------------------
  select count(*) into v_count from public.scenario_answer_keys;
  if v_count <> 144 then
    raise exception 'Assertion failed: Expected 144 scenario answer keys, found %', v_count;
  end if;

  select count(distinct scenario_id), count(distinct question_id), count(distinct module_id)
  into v_scenario_count, v_question_count, v_module_count
  from public.scenario_answer_keys;

  if v_scenario_count <> 16 then
    raise exception 'Assertion failed: Expected 16 unique scenarios, found %', v_scenario_count;
  end if;
  if v_question_count <> 48 then
    raise exception 'Assertion failed: Expected 48 unique questions, found %', v_question_count;
  end if;
  if v_module_count <> 4 then
    raise exception 'Assertion failed: Expected 4 unique modules, found %', v_module_count;
  end if;

  select
    count(*) filter (where outcome = 'sustainable'),
    count(*) filter (where outcome = 'partially_sustainable'),
    count(*) filter (where outcome = 'unsustainable')
  into v_sustainable_count, v_partially_count, v_unsustainable_count
  from public.scenario_answer_keys;

  if v_sustainable_count <> 48 or v_partially_count <> 36 or v_unsustainable_count <> 60 then
    raise exception 'Assertion failed: Unexpected outcome distribution (sustainable: %, partially: %, unsustainable: %)',
      v_sustainable_count, v_partially_count, v_unsustainable_count;
  end if;

  -- Verify scoring rubric consistency constraint
  select exists (
    select 1
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'scenario_answer_keys'
      and c.conname = 'chk_scenario_answer_keys_scoring'
  ) into v_has_constraint;

  if not v_has_constraint then
    raise exception 'Assertion failed: Constraint chk_scenario_answer_keys_scoring not found!';
  end if;

  -- Verify 0 invalid scoring entries
  select count(*) into v_invalid_scoring
  from public.scenario_answer_keys
  where not (
    (outcome = 'sustainable' and xp = 100 and coins = 10) or
    (outcome = 'partially_sustainable' and xp = 40 and coins = 4) or
    (outcome = 'unsustainable' and xp = 0 and coins = 0)
  );

  if v_invalid_scoring <> 0 then
    raise exception 'Assertion failed: Found % rows violating scoring rules!', v_invalid_scoring;
  end if;
  raise notice 'PASS [2/7]: Seed data and scoring integrity verified (144 canonical rows, 0 violations).';

  -- --------------------------------------------------------------------------
  -- 3. VERIFY RPC FUNCTION EXISTENCE, SECURITY DEFINER & TRUSTED OWNERSHIP
  -- --------------------------------------------------------------------------
  -- A. Exact function existence and overload checks
  select count(*) into v_func_count
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'submit_verified_scenario';
  if v_func_count <> 1 then
    raise exception 'Assertion failed: Expected exactly 1 overload for submit_verified_scenario, found %', v_func_count;
  end if;

  select count(*) into v_func_count
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'get_leaderboard';
  if v_func_count <> 1 then
    raise exception 'Assertion failed: Expected exactly 1 overload for get_leaderboard, found %', v_func_count;
  end if;

  select count(*) into v_func_count
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'get_my_leaderboard_rank';
  if v_func_count <> 1 then
    raise exception 'Assertion failed: Expected exactly 1 overload for get_my_leaderboard_rank, found %', v_func_count;
  end if;

  if to_regprocedure('public.submit_verified_scenario(text, jsonb)') is null then
    raise exception 'Assertion failed: Function public.submit_verified_scenario(text, jsonb) does not exist!';
  end if;
  if to_regprocedure('public.get_leaderboard(integer, integer)') is null then
    raise exception 'Assertion failed: Function public.get_leaderboard(integer, integer) does not exist!';
  end if;
  if to_regprocedure('public.get_my_leaderboard_rank()') is null then
    raise exception 'Assertion failed: Function public.get_my_leaderboard_rank() does not exist!';
  end if;

  -- B. Verify SECURITY DEFINER, search_path, and trusted ownership for all 3 functions
  for v_func_record in
    select
      p.proname,
      p.prosecdef,
      p.proconfig,
      r.rolname as owner_name,
      r.rolsuper as owner_is_super,
      r.rolbypassrls as owner_bypasses_rls,
      c_sak.relowner = p.proowner as owns_answer_keys,
      c_prof.relowner = p.proowner as owns_profiles
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    join pg_roles r on r.oid = p.proowner
    left join pg_class c_sak on c_sak.relname = 'scenario_answer_keys' and c_sak.relnamespace = n.oid
    left join pg_class c_prof on c_prof.relname = 'profiles' and c_prof.relnamespace = n.oid
    where n.nspname = 'public'
      and p.proname in ('submit_verified_scenario', 'get_leaderboard', 'get_my_leaderboard_rank')
  loop
    if not v_func_record.prosecdef then
      raise exception 'Assertion failed: Function % is NOT SECURITY DEFINER!', v_func_record.proname;
    end if;

    if not coalesce(
      'search_path=pg_catalog, public, pg_temp' = any(v_func_record.proconfig),
      false
    ) then
      raise exception 'Assertion failed: Function % does not have hardened search_path (found: %)',
        v_func_record.proname, v_func_record.proconfig;
    end if;

    -- Verify function owner is trusted (e.g. postgres, supabase_admin, or superuser / bypassrls)
    if not (v_func_record.owner_name in ('postgres', 'supabase_admin') or v_func_record.owner_is_super or v_func_record.owner_bypasses_rls) then
      raise exception 'Assertion failed: Function % is owned by untrusted role %',
        v_func_record.proname, v_func_record.owner_name;
    end if;

    -- Verify owner can read scenario_answer_keys and profiles
    -- In PostgreSQL, table owners and superusers bypass RLS unless FORCE ROW LEVEL SECURITY is set
    if not (v_func_record.owner_is_super or v_func_record.owner_bypasses_rls or (v_func_record.owns_answer_keys and v_func_record.owns_profiles)) then
      raise exception 'Assertion failed: Function owner % cannot read protected tables under RLS!', v_func_record.owner_name;
    end if;
  end loop;

  -- Confirm FORCE ROW LEVEL SECURITY is not set on scenario_answer_keys or profiles (which would block the owner)
  select relforcerowsecurity into v_relforce from pg_class where relname = 'scenario_answer_keys' and relnamespace = 'public'::regnamespace;
  if v_relforce then
    raise exception 'Assertion failed: FORCE ROW LEVEL SECURITY is active on scenario_answer_keys!';
  end if;

  select relforcerowsecurity into v_relforce from pg_class where relname = 'profiles' and relnamespace = 'public'::regnamespace;
  if v_relforce then
    raise exception 'Assertion failed: FORCE ROW LEVEL SECURITY is active on profiles!';
  end if;
  raise notice 'PASS [3/7]: Function existence, no unexpected overloads, SECURITY DEFINER, and trusted ownership verified.';

  -- --------------------------------------------------------------------------
  -- 4. VERIFY EFFECTIVE FUNCTION EXECUTION PRIVILEGES & ACLs
  -- --------------------------------------------------------------------------
  -- Note: Testing effective privileges on 'anon' and 'authenticated' automatically
  -- tests privileges inherited through PUBLIC grants without invalidly treating
  -- PUBLIC as an ordinary role name. Explicit ACL inspection confirms no PUBLIC grant.

  -- A. submit_verified_scenario: authenticated only
  if not has_function_privilege('authenticated', 'public.submit_verified_scenario(text, jsonb)', 'execute') then
    raise exception 'Assertion failed: authenticated must have EXECUTE on submit_verified_scenario';
  end if;
  if has_function_privilege('anon', 'public.submit_verified_scenario(text, jsonb)', 'execute') then
    raise exception 'Assertion failed: anon must NOT have EXECUTE on submit_verified_scenario';
  end if;
  select count(*) into v_public_acl_count
  from pg_proc p
  cross join lateral aclexplode(p.proacl) a
  where p.proname = 'submit_verified_scenario'
    and p.pronamespace = 'public'::regnamespace
    and a.grantee = 0
    and a.privilege_type = 'EXECUTE';
  if v_public_acl_count > 0 then
    raise exception 'Assertion failed: submit_verified_scenario has explicit EXECUTE grant to PUBLIC!';
  end if;

  -- B. get_leaderboard: anon and authenticated
  if not has_function_privilege('anon', 'public.get_leaderboard(integer, integer)', 'execute') then
    raise exception 'Assertion failed: anon must have EXECUTE on get_leaderboard';
  end if;
  if not has_function_privilege('authenticated', 'public.get_leaderboard(integer, integer)', 'execute') then
    raise exception 'Assertion failed: authenticated must have EXECUTE on get_leaderboard';
  end if;
  select count(*) into v_public_acl_count
  from pg_proc p
  cross join lateral aclexplode(p.proacl) a
  where p.proname = 'get_leaderboard'
    and p.pronamespace = 'public'::regnamespace
    and a.grantee = 0
    and a.privilege_type = 'EXECUTE';
  if v_public_acl_count > 0 then
    raise exception 'Assertion failed: get_leaderboard has explicit EXECUTE grant to PUBLIC!';
  end if;

  -- C. get_my_leaderboard_rank: authenticated only
  if not has_function_privilege('authenticated', 'public.get_my_leaderboard_rank()', 'execute') then
    raise exception 'Assertion failed: authenticated must have EXECUTE on get_my_leaderboard_rank';
  end if;
  if has_function_privilege('anon', 'public.get_my_leaderboard_rank()', 'execute') then
    raise exception 'Assertion failed: anon must NOT have EXECUTE on get_my_leaderboard_rank';
  end if;
  select count(*) into v_public_acl_count
  from pg_proc p
  cross join lateral aclexplode(p.proacl) a
  where p.proname = 'get_my_leaderboard_rank'
    and p.pronamespace = 'public'::regnamespace
    and a.grantee = 0
    and a.privilege_type = 'EXECUTE';
  if v_public_acl_count > 0 then
    raise exception 'Assertion failed: get_my_leaderboard_rank has explicit EXECUTE grant to PUBLIC!';
  end if;
  raise notice 'PASS [4/7]: Effective RPC function execution permissions and ACLs verified.';

  -- --------------------------------------------------------------------------
  -- 5. VERIFY EFFECTIVE TABLE PRIVILEGES (SELECT, INSERT, UPDATE, DELETE, TRUNCATE) & ACLs
  -- --------------------------------------------------------------------------
  -- A. scenario_answer_keys: NO direct client access (SELECT, INSERT, UPDATE, DELETE, TRUNCATE)
  if has_table_privilege('anon', 'public.scenario_answer_keys', 'select') or
     has_table_privilege('authenticated', 'public.scenario_answer_keys', 'select') then
    raise exception 'Assertion failed: Direct SELECT on scenario_answer_keys must be revoked from clients!';
  end if;
  if has_table_privilege('anon', 'public.scenario_answer_keys', 'insert') or
     has_table_privilege('authenticated', 'public.scenario_answer_keys', 'insert') or
     has_table_privilege('anon', 'public.scenario_answer_keys', 'update') or
     has_table_privilege('authenticated', 'public.scenario_answer_keys', 'update') or
     has_table_privilege('anon', 'public.scenario_answer_keys', 'delete') or
     has_table_privilege('authenticated', 'public.scenario_answer_keys', 'delete') or
     has_table_privilege('anon', 'public.scenario_answer_keys', 'truncate') or
     has_table_privilege('authenticated', 'public.scenario_answer_keys', 'truncate') then
    raise exception 'Assertion failed: Write/TRUNCATE privileges on scenario_answer_keys must be revoked from clients!';
  end if;
  select count(*) into v_public_acl_count
  from pg_class c
  cross join lateral aclexplode(c.relacl) a
  where c.relname = 'scenario_answer_keys'
    and c.relnamespace = 'public'::regnamespace
    and a.grantee = 0;
  if v_public_acl_count > 0 then
    raise exception 'Assertion failed: scenario_answer_keys has explicit grants to PUBLIC!';
  end if;

  -- B. verified_scores: authenticated SELECT only; NO client writes, NO client TRUNCATE
  if not has_table_privilege('authenticated', 'public.verified_scores', 'select') then
    raise exception 'Assertion failed: authenticated must have SELECT on verified_scores';
  end if;
  if has_table_privilege('anon', 'public.verified_scores', 'select') then
    raise exception 'Assertion failed: anon must NOT have SELECT on verified_scores';
  end if;
  if has_table_privilege('anon', 'public.verified_scores', 'insert') or
     has_table_privilege('authenticated', 'public.verified_scores', 'insert') or
     has_table_privilege('anon', 'public.verified_scores', 'update') or
     has_table_privilege('authenticated', 'public.verified_scores', 'update') or
     has_table_privilege('anon', 'public.verified_scores', 'delete') or
     has_table_privilege('authenticated', 'public.verified_scores', 'delete') or
     has_table_privilege('anon', 'public.verified_scores', 'truncate') or
     has_table_privilege('authenticated', 'public.verified_scores', 'truncate') then
    raise exception 'Assertion failed: Client write/TRUNCATE privileges on verified_scores must be completely revoked!';
  end if;
  select count(*) into v_public_acl_count
  from pg_class c
  cross join lateral aclexplode(c.relacl) a
  where c.relname = 'verified_scores'
    and c.relnamespace = 'public'::regnamespace
    and a.grantee = 0;
  if v_public_acl_count > 0 then
    raise exception 'Assertion failed: verified_scores has explicit grants to PUBLIC!';
  end if;

  -- C. leaderboard_standings: anon and authenticated SELECT; NO client writes, NO client TRUNCATE
  if not has_table_privilege('anon', 'public.leaderboard_standings', 'select') or
     not has_table_privilege('authenticated', 'public.leaderboard_standings', 'select') then
    raise exception 'Assertion failed: anon and authenticated must have SELECT on leaderboard_standings';
  end if;
  if has_table_privilege('anon', 'public.leaderboard_standings', 'insert') or
     has_table_privilege('authenticated', 'public.leaderboard_standings', 'insert') or
     has_table_privilege('anon', 'public.leaderboard_standings', 'update') or
     has_table_privilege('authenticated', 'public.leaderboard_standings', 'update') or
     has_table_privilege('anon', 'public.leaderboard_standings', 'delete') or
     has_table_privilege('authenticated', 'public.leaderboard_standings', 'delete') or
     has_table_privilege('anon', 'public.leaderboard_standings', 'truncate') or
     has_table_privilege('authenticated', 'public.leaderboard_standings', 'truncate') then
    raise exception 'Assertion failed: Client write/TRUNCATE privileges on leaderboard_standings must be completely revoked!';
  end if;
  select count(*) into v_public_acl_count
  from pg_class c
  cross join lateral aclexplode(c.relacl) a
  where c.relname = 'leaderboard_standings'
    and c.relnamespace = 'public'::regnamespace
    and a.grantee = 0;
  if v_public_acl_count > 0 then
    raise exception 'Assertion failed: leaderboard_standings has explicit grants to PUBLIC!';
  end if;
  raise notice 'PASS [5/7]: Effective table privileges (including TRUNCATE) and ACLs verified.';

  -- --------------------------------------------------------------------------
  -- 6. VERIFY ROW LEVEL SECURITY & EXACT POLICY DEFINITIONS
  -- --------------------------------------------------------------------------
  select rowsecurity into v_rls_enabled from pg_tables where schemaname = 'public' and tablename = 'scenario_answer_keys';
  if not v_rls_enabled then raise exception 'Assertion failed: RLS not active on scenario_answer_keys'; end if;

  select rowsecurity into v_rls_enabled from pg_tables where schemaname = 'public' and tablename = 'verified_scores';
  if not v_rls_enabled then raise exception 'Assertion failed: RLS not active on verified_scores'; end if;

  select rowsecurity into v_rls_enabled from pg_tables where schemaname = 'public' and tablename = 'leaderboard_standings';
  if not v_rls_enabled then raise exception 'Assertion failed: RLS not active on leaderboard_standings'; end if;

  -- A. scenario_answer_keys: exactly ZERO policies (default deny all for clients)
  select count(*) into v_policy_count from pg_policy where polrelid = 'public.scenario_answer_keys'::regclass;
  if v_policy_count <> 0 then
    raise exception 'Assertion failed: scenario_answer_keys must have exactly 0 policies (found: %)', v_policy_count;
  end if;

  -- B. verified_scores: exactly ONE policy, own-row SELECT, exactly authenticated role
  select count(*) into v_policy_count from pg_policy where polrelid = 'public.verified_scores'::regclass;
  if v_policy_count <> 1 then
    raise exception 'Assertion failed: verified_scores must have exactly 1 policy (found: %)', v_policy_count;
  end if;

  select * into v_policy_record
  from pg_policy
  where polrelid = 'public.verified_scores'::regclass;

  if v_policy_record.polname <> 'Users can view own verified scores' then
    raise exception 'Assertion failed: verified_scores policy name mismatch (found: %)', v_policy_record.polname;
  end if;
  if v_policy_record.polcmd <> 'r' then
    raise exception 'Assertion failed: verified_scores policy command must be SELECT (r), found: %', v_policy_record.polcmd;
  end if;
  -- Exact role validation: must be exactly authenticated role array
  if v_policy_record.polroles <> array['authenticated'::regrole::oid] then
    raise exception 'Assertion failed: verified_scores policy roles must be exactly {authenticated}, found: %', v_policy_record.polroles;
  end if;
  -- USING expression check: auth.uid() = user_id
  if pg_get_expr(v_policy_record.polqual, v_policy_record.polrelid) not in ('(auth.uid() = user_id)', 'auth.uid() = user_id') then
    raise exception 'Assertion failed: verified_scores policy condition unexpected: %',
      pg_get_expr(v_policy_record.polqual, v_policy_record.polrelid);
  end if;

  -- C. leaderboard_standings: exactly ONE policy, public SELECT using (true), exactly PUBLIC (0)
  select count(*) into v_policy_count from pg_policy where polrelid = 'public.leaderboard_standings'::regclass;
  if v_policy_count <> 1 then
    raise exception 'Assertion failed: leaderboard_standings must have exactly 1 policy (found: %)', v_policy_count;
  end if;

  select * into v_policy_record
  from pg_policy
  where polrelid = 'public.leaderboard_standings'::regclass;

  if v_policy_record.polname <> 'Public view of leaderboard standings' then
    raise exception 'Assertion failed: leaderboard_standings policy name mismatch (found: %)', v_policy_record.polname;
  end if;
  if v_policy_record.polcmd <> 'r' then
    raise exception 'Assertion failed: leaderboard_standings policy command must be SELECT (r), found: %', v_policy_record.polcmd;
  end if;
  -- Exact role validation: must be exactly PUBLIC (OID 0)
  if v_policy_record.polroles <> array[0::oid] then
    raise exception 'Assertion failed: leaderboard_standings policy roles must be exactly {0} (PUBLIC), found: %', v_policy_record.polroles;
  end if;
  -- USING expression check: true
  if pg_get_expr(v_policy_record.polqual, v_policy_record.polrelid) <> 'true' then
    raise exception 'Assertion failed: leaderboard_standings policy condition unexpected: %',
      pg_get_expr(v_policy_record.polqual, v_policy_record.polrelid);
  end if;

  raise notice 'PASS [6/7]: Row Level Security status and exact policy definitions verified.';

  -- --------------------------------------------------------------------------
  -- 7. VERIFY PUBLIC SCHEMA PRIVILEGES & ACLs
  -- --------------------------------------------------------------------------
  -- Clients must NOT have CREATE privilege on schema public
  if has_schema_privilege('anon', 'public', 'create') then
    raise exception 'Assertion failed: anon has CREATE on schema public!';
  end if;
  if has_schema_privilege('authenticated', 'public', 'create') then
    raise exception 'Assertion failed: authenticated has CREATE on schema public!';
  end if;

  -- Inspect schema ACL for explicit CREATE to PUBLIC
  select count(*) into v_public_acl_count
  from pg_namespace n
  cross join lateral aclexplode(n.nspacl) a
  where n.nspname = 'public'
    and a.grantee = 0
    and a.privilege_type = 'CREATE';
  if v_public_acl_count > 0 then
    raise exception 'Assertion failed: schema public has explicit CREATE grant to PUBLIC!';
  end if;

  -- USAGE must remain intact so client roles can access tables and functions
  if not has_schema_privilege('anon', 'public', 'usage') or
     not has_schema_privilege('authenticated', 'public', 'usage') then
    raise exception 'Assertion failed: USAGE privilege on schema public is missing for client roles!';
  end if;
  raise notice 'PASS [7/7]: Public schema privileges verified (CREATE revoked, USAGE intact).';

  raise notice '============================================================';
  raise notice 'ALL 7 VERIFICATION CHECKS AND ASSERTIONS PASSED SUCCESSFULLY.';
  raise notice '============================================================';
end $$;
