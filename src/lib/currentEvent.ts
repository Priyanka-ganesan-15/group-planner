"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCurrentEventId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1) Try user_settings.current_event_id
  const { data: settings } = await supabase
    .from("user_settings")
    .select("current_event_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const selectedId = settings?.current_event_id as string | null;

  if (selectedId) {
    // verify membership (RLS should already enforce, but we double-check)
    const { data: membership } = await supabase
      .from("event_members")
      .select("id")
      .eq("event_id", selectedId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (membership) return selectedId;
  }

  // 2) Fallback to most recently joined
  const { data: recent } = await supabase
    .from("event_members")
    .select("event_id, joined_at")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false })
    .limit(1);

  return (recent?.[0]?.event_id as string) ?? null;
}
