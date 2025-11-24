-- SUPABASE SQL SCHEMA FOR GROUP PLANNER
-- Run this in your Supabase SQL Editor

-- Enable UUIDs
create extension if not exists "uuid-ossp";

-- EVENTS TABLE
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  type text not null check (type in ('trip','party','hangout','other')),
  start_date date,
  end_date date,
  location text,
  invite_code text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- EVENT MEMBERS TABLE
create table if not exists public.event_members (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','member')) default 'member',
  joined_at timestamp with time zone default now(),
  unique (event_id, user_id)
);

-- TASKS TABLE
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  description text,
  status text not null check (status in ('todo','doing','done')) default 'todo',
  assignee_id uuid references auth.users(id) on delete set null,
  due_date date,
  priority text check (priority in ('low','medium','high')),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.events enable row level security;
alter table public.event_members enable row level security;
alter table public.tasks enable row level security;

-- EVENTS POLICIES
-- Members can read events they belong to
create policy "events_select_members"
on public.events
for select
using (
  exists (
    select 1 from public.event_members m
    where m.event_id = events.id
      and m.user_id = auth.uid()
  )
);

-- Owners can update/delete their events
create policy "events_update_owner"
on public.events
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "events_delete_owner"
on public.events
for delete
using (owner_id = auth.uid());

-- Any authenticated user can create an event (they become owner)
create policy "events_insert_authenticated"
on public.events
for insert
with check (auth.uid() = owner_id);

-- EVENT MEMBERS POLICIES
-- Users can only see their own membership rows (simplified to avoid recursion)
-- To see other members, query through the events table with a join
create policy "members_select_own"
on public.event_members
for select
using (user_id = auth.uid());

-- Authenticated user can insert a membership row for themselves (join)
create policy "members_insert_self"
on public.event_members
for insert
with check (user_id = auth.uid());

-- Owners/admins can update roles
create policy "members_update_owner_admin"
on public.event_members
for update
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
using (
  exists (
    select 1 from public.event_members m
    where m.event_id = tasks.event_id
      and m.user_id = auth.uid()
  )
);

-- Members can insert tasks for events they belong to (created_by = self)
create policy "tasks_insert_members"
on public.tasks
for insert
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
using (
  created_by = auth.uid()
  OR exists (
    select 1 from public.event_members m
    where m.event_id = tasks.event_id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  )
);
