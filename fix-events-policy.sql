-- Fix events insert policy
-- Run this in Supabase SQL Editor

-- Drop the old insert policy
drop policy if exists "events_insert_authenticated" on public.events;

-- Create a simpler insert policy - any authenticated user can insert
-- The owner_id must match their own user id
create policy "events_insert_authenticated"
on public.events
for insert
to authenticated
with check (owner_id = auth.uid());
