"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function setCurrentEvent(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // upsert settings row
  await supabase
    .from("user_settings")
    .upsert({
      user_id: user.id,
      current_event_id: eventId,
      updated_at: new Date().toISOString(),
    });

  revalidatePath("/");
  revalidatePath("/tasks");
  revalidatePath("/members");
  revalidatePath("/events");
}
