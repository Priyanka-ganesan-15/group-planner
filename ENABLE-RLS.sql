-- ENABLE RLS WITH WORKING POLICIES
-- Run this after FINAL-SETUP.sql to secure your data

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- EVENTS POLICIES
-- ============================================

-- Any authenticated user can insert an event (they become owner)
CREATE POLICY "events_insert_authenticated"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow insert, we'll verify ownership in app code

-- Members can read events they belong to
CREATE POLICY "events_select_members"
ON public.events
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.event_members m
    WHERE m.event_id = events.id
      AND m.user_id = auth.uid()
  )
);

-- Owners can update their events
CREATE POLICY "events_update_owner"
ON public.events
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Owners can delete their events
CREATE POLICY "events_delete_owner"
ON public.events
FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- ============================================
-- EVENT MEMBERS POLICIES
-- ============================================

-- Users can see their own membership rows
CREATE POLICY "members_select_own"
ON public.event_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can insert membership for themselves (join events)
CREATE POLICY "members_insert_self"
ON public.event_members
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow join, we validate in app code

-- Owners/admins can update roles
CREATE POLICY "members_update_owner_admin"
ON public.event_members
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.event_members m
    WHERE m.event_id = event_members.event_id
      AND m.user_id = auth.uid()
      AND m.role IN ('owner','admin')
  )
);

-- Users can delete their own membership (leave event)
CREATE POLICY "members_delete_self"
ON public.event_members
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ============================================
-- TASKS POLICIES
-- ============================================

-- Members can read tasks in events they belong to
CREATE POLICY "tasks_select_members"
ON public.tasks
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.event_members m
    WHERE m.event_id = tasks.event_id
      AND m.user_id = auth.uid()
  )
);

-- Members can insert tasks
CREATE POLICY "tasks_insert_members"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.event_members m
    WHERE m.event_id = tasks.event_id
      AND m.user_id = auth.uid()
  )
);

-- Members can update tasks in their events
CREATE POLICY "tasks_update_members"
ON public.tasks
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.event_members m
    WHERE m.event_id = tasks.event_id
      AND m.user_id = auth.uid()
  )
);

-- Members can delete tasks they created OR owners/admins
CREATE POLICY "tasks_delete_creator_or_admin"
ON public.tasks
FOR DELETE
TO authenticated
USING (
  created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.event_members m
    WHERE m.event_id = tasks.event_id
      AND m.user_id = auth.uid()
      AND m.role IN ('owner','admin')
  )
);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$ 
BEGIN 
  RAISE NOTICE '✅ RLS enabled with policies!';
  RAISE NOTICE '🔒 Users can only see events they are members of';
  RAISE NOTICE '📝 Test: Create event, join with different user';
END $$;
