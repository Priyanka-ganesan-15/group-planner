-- BACKFILL existing users into profiles table
-- Run this in Supabase SQL Editor

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

DO $$ 
BEGIN 
  RAISE NOTICE '✅ Existing users backfilled into profiles!';
END $$;
