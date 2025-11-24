-- Complete RLS Policy Reset
-- Run this entire script in Supabase SQL Editor

-- Drop all existing policies
drop policy if exists "events_select_members" on public.events;
drop policy if exists "events_update_owner" on public.events;
drop policy if exists "events_delete_owner" on public.events;
drop policy if exists "events_insert_authenticated" on public.events;
drop policy if exists "members_select_event_members" on public.events;
drop policy if exists "members_select_own" on public.event_members;
drop policy if exists "members_insert_self" on public.event_members;
drop policy if exists "members_update_owner_admin" on public.event_members;
drop policy if exists "tasks_select_members" on public.tasks;
drop policy if exists "tasks_insert_members" on public.tasks;
drop policy if exists "tasks_update_members" on public.tasks;
drop policy if exists "tasks_delete_creator_or_admin" on public.tasks;

-- EVENTS POLICIES
-- Any authenticated user can insert an event (they become owner)
create policy "events_insert_authenticated"
on public.events
for insert
to authenticated
with check (owner_id = auth.uid());

-- Members can read events they belong to
create policy "events_select_members"
on public.events
for select
to authenticated
using (
  exists (
    select 1 from public.event_members m
    where m.event_id = events.id
      and m.user_id = auth.uid()
  )
);

-- Owners can update their events
create policy "events_update_owner"
on public.events
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

-- Owners can delete their events
create policy "events_delete_owner"
on public.events
for delete
to authenticated
using (owner_id = auth.uid());

-- EVENT MEMBERS POLICIES
-- Users can see their own membership rows
create policy "members_select_own"
on public.event_members
for select
to authenticated
using (user_id = auth.uid());

-- Users can insert membership for themselves (join events)
create policy "members_insert_self"
on public.event_members
for insert
to authenticated
with check (user_id = auth.uid());

-- Owners/admins can update roles
create policy "members_update_owner_admin"
on public.event_members
for update
to authenticated
using (
  exists (
    select 1 from public.event_members m
    where m.event_id = event_members.event_id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  )
);

-- TASKS POLICIES
-- Members can read tasks in events they belong to
create policy "tasks_select_members"
on public.tasks
for select
to authenticated
using (
  exists (
    select 1 from public.event_members m
    where m.event_id = tasks.event_id
      and m.user_id = auth.uid()
  )
);

-- Members can insert tasks (creator = self)
create policy "tasks_insert_members"
on public.tasks
for insert
to authenticated
with check (
  created_by = auth.uid()
  and exists (
    select 1 from public.event_members m
    where m.event_id = tasks.event_id
      and m.user_id = auth.uid()
  )
);

-- Members can update tasks in their events
create policy "tasks_update_members"
on public.tasks
for update
to authenticated
using (
  exists (
    select 1 from public.event_members m
    where m.event_id = tasks.event_id
      and m.user_id = auth.uid()
  )
);

-- Members can delete tasks they created OR owners/admins
create policy "tasks_delete_creator_or_admin"
on public.tasks
for delete
to authenticated
using (
  created_by = auth.uid()
  OR exists (
    select 1 from public.event_members m
    where m.event_id = tasks.event_id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  )
);
