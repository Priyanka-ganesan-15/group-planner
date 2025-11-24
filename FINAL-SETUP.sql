-- COMPLETE DATABASE SETUP - RUN THIS ENTIRE SCRIPT
-- This will drop and recreate everything from scratch

-- Drop existing tables (cascade removes all data and dependencies)
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.event_members CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;

-- Drop the helper function if it exists
DROP FUNCTION IF EXISTS get_event_members(uuid);

-- Enable UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CREATE TABLES
-- ============================================

-- EVENTS TABLE
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('trip','party','hangout','other')),
  start_date DATE,
  end_date DATE,
  location TEXT,
  invite_code TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EVENT MEMBERS TABLE
CREATE TABLE public.event_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','admin','member')) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (event_id, user_id)
);

-- TASKS TABLE
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('todo','doing','done')) DEFAULT 'todo',
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date DATE,
  priority TEXT CHECK (priority IN ('low','medium','high')),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DISABLE RLS TEMPORARILY (for testing)
-- ============================================
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE HELPER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION get_event_members(p_event_id UUID)
RETURNS TABLE (
  id UUID,
  event_id UUID,
  user_id UUID,
  role TEXT,
  joined_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE SQL
AS $$
  SELECT id, event_id, user_id, role, joined_at
  FROM event_members
  WHERE event_id = p_event_id;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_event_members(UUID) TO authenticated;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT ALL ON public.events TO authenticated;
GRANT ALL ON public.event_members TO authenticated;
GRANT ALL ON public.tasks TO authenticated;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$ 
BEGIN 
  RAISE NOTICE '✅ Database setup complete!';
  RAISE NOTICE '⚠️  RLS is DISABLED for testing';
  RAISE NOTICE '📝 You can now create events without RLS blocking';
END $$;
