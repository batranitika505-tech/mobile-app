-- ==============================================================================
-- JalRakshak: Groundwater Conservation Educational Application
-- Migration: Grant Minimum Required Privileges to Authenticated Role
-- Milestone 2C Fix: Cloud Sync Permissions
-- ==============================================================================

-- 1. Grant SELECT, INSERT, UPDATE privileges on public.game_progress to authenticated
-- RLS remains enabled and enforced: users can only read, insert, and update rows where auth.uid() = user_id.
grant select, insert, update on table public.game_progress to authenticated;

-- 2. Grant SELECT privilege on public.profiles to authenticated
-- RLS remains enabled and enforced: users can only view their own profile (auth.uid() = id).
grant select on table public.profiles to authenticated;

-- 3. Grant column-level UPDATE on public.profiles to authenticated
-- Restrict updates strictly to user-editable fields; do not allow editing id, email, or created_at directly.
grant update (full_name, display_name, avatar_url, updated_at) on table public.profiles to authenticated;

-- Notice:
-- - No DELETE privileges are granted.
-- - No unrestricted table privileges are granted to anon.
-- - Existing Row Level Security (RLS) policies remain active and enforced on all operations.
