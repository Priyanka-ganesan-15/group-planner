-- USER SETTINGS TABLE FOR PERSISTENT EVENT SELECTION
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Users can select their own settings
CREATE POLICY "settings_select_own"
ON public.user_settings
FOR SELECT
USING (user_id = auth.uid());

-- Users can insert/update only their own row
CREATE POLICY "settings_upsert_own"
ON public.user_settings
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "settings_update_own"
ON public.user_settings
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DO $$ 
BEGIN 
  RAISE NOTICE '✅ user_settings table created!';
  RAISE NOTICE '📝 Current event selection will persist across sessions';
END $$;
