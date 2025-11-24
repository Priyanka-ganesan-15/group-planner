"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentEventId } from "@/lib/currentEvent";
import { revalidatePath } from "next/cache";

export async function updateMemberRole(userId: string, role: "admin" | "member") {
  const supabase = await createClient();
  const eventId = await getCurrentEventId();
  if (!eventId) return;

  const { error } = await supabase
    .from("event_members")
    .update({ role })
    .eq("event_id", eventId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/members");
}

export async function removeMember(userId: string) {
  const supabase = await createClient();
  const eventId = await getCurrentEventId();
  if (!eventId) return;

  const { error } = await supabase
    .from("event_members")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/members");
}
