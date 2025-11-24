-- ADD FOREIGN KEY from event_members to profiles
-- Run this in Supabase SQL Editor

-- Add foreign key constraint from event_members.user_id to profiles.id
ALTER TABLE public.event_members
DROP CONSTRAINT IF EXISTS event_members_user_id_fkey;

ALTER TABLE public.event_members
ADD CONSTRAINT event_members_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

DO $$ 
BEGIN 
  RAISE NOTICE '✅ Foreign key added: event_members.user_id -> profiles.id';
  RAISE NOTICE '✅ Now you can join event_members with profiles!';
END $$;
