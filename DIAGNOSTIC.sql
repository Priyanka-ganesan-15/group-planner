-- Diagnostic: Check what's blocking inserts
-- Run this to see current policies

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('events', 'event_members', 'tasks');

-- Check all policies on events table
SELECT policyname, cmd, permissive, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'events';

-- Check all policies on event_members table
SELECT policyname, cmd, permissive, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'event_members';
