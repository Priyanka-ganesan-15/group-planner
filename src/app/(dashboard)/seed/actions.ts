"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentEventId } from "@/lib/currentEvent";
import { revalidatePath } from "next/cache";

export async function seedDemoTasks() {
  const supabase = await createClient();
  const eventId = await getCurrentEventId();
  if (!eventId) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const demo = [
    { title: "Finalize itinerary", status: "todo", priority: "high", due_date: new Date(Date.now()+3*86400000).toISOString().slice(0,10) },
    { title: "Book stay / venue", status: "doing", priority: "high", due_date: new Date(Date.now()+2*86400000).toISOString().slice(0,10) },
    { title: "Assign food responsibilities", status: "todo", priority: "medium", due_date: new Date(Date.now()+5*86400000).toISOString().slice(0,10) },
    { title: "Create packing list", status: "todo", priority: "low" },
    { title: "Collect payments", status: "done", priority: "medium" },
  ];

  await supabase.from("tasks").insert(
    demo.map(d => ({
      ...d,
      event_id: eventId,
      created_by: user.id,
    }))
  );

  revalidatePath("/");
  revalidatePath("/tasks");
  revalidatePath(`/events/${eventId}`);
}
