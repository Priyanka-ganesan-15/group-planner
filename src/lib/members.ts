"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentEventId } from "@/lib/currentEvent";

export async function getCurrentEventMembers() {
  const supabase = await createClient();
  const eventId = await getCurrentEventId();
  if (!eventId) return [];

  const { data } = await supabase
    .from("event_members")
    .select("user_id, role, profiles(name,email)")
    .eq("event_id", eventId)
    .order("joined_at", { ascending: true });

  return data ?? [];
}
