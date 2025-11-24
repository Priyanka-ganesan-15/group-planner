"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function joinByInviteCode(inviteCode: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "not_logged_in" as const };

  const code = inviteCode.toUpperCase().trim();

  const { data: event, error: eErr } = await supabase
    .from("events")
    .select("id")
    .eq("invite_code", code)
    .single();

  if (eErr || !event) {
    return { ok: false, reason: "invalid_code" as const };
  }

  // Try insert membership; if already exists, ignore
  const { error: mErr } = await supabase
    .from("event_members")
    .insert({
      event_id: event.id,
      user_id: user.id,
      role: "member",
    });

  if (mErr && !String(mErr.message).toLowerCase().includes("duplicate")) {
    return { ok: false, reason: "join_failed" as const, message: mErr.message };
  }

  // Set current event for user
  await supabase.from("user_settings").upsert({
    user_id: user.id,
    current_event_id: event.id,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/tasks");
  revalidatePath("/members");

  redirect(`/events/${event.id}`);
}
