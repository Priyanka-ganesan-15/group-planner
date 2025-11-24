-- PROFILES + TRIGGERS + RLS + MEMBER DELETE POLICY + BACKFILL
-- Run this in Supabase SQL Editor

-- PROFILES TABLE (public user display)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read profiles ONLY if they're in a shared event
CREATE POLICY "profiles_select_shared_event"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.event_members m1
    JOIN public.event_members m2
      ON m1.event_id = m2.event_id
    WHERE m1.user_id = auth.uid()
      AND m2.user_id = profiles.id
  )
);

-- Users can insert/update only their own profile
CREATE POLICY "profiles_upsert_own"
ON public.profiles
FOR INSERT
WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Trigger to auto-create/update profile on signup/login metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        name = EXCLUDED.name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- BACKFILL existing users into profiles table
INSERT INTO public.profiles (id, email, name, avatar_url)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', email), 
  raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = EXCLUDED.name,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = NOW();

-- Allow owner/admin to remove members (delete membership rows)
DROP POLICY IF EXISTS "members_delete_owner_admin" ON public.event_members;
CREATE POLICY "members_delete_owner_admin"
ON public.event_members
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.event_members m
    WHERE m.event_id = event_members.event_id
      AND m.user_id = auth.uid()
      AND m.role IN ('owner','admin')
  )
  AND role <> 'owner'
);

DO $$ 
BEGIN 
  RAISE NOTICE '✅ Profiles table created with RLS!';
  RAISE NOTICE '✅ Auto-profile trigger enabled on signup!';
  RAISE NOTICE '✅ Existing users backfilled into profiles!';
  RAISE NOTICE '✅ Member delete policy added!';
END $$;
