-- Fix infinite recursion in event_members policy
-- Run this in Supabase SQL Editor

-- Drop the problematic policy
drop policy if exists "members_select_event_members" on public.event_members;

-- Create a function to get event members (security definer to bypass RLS)
create or replace function get_event_members(p_event_id uuid)
returns table (
  id uuid,
  event_id uuid,
  user_id uuid,
  role text,
  joined_at timestamptz
)
security definer
set search_path = public
language sql
as $$
  select id, event_id, user_id, role, joined_at
  from event_members
  where event_id = p_event_id;
$$;

-- Grant execute to authenticated users
grant execute on function get_event_members(uuid) to authenticated;

-- Create simplified policy - users can only see their own membership rows
create policy "members_select_own"
on public.event_members
for select
using (user_id = auth.uid());
