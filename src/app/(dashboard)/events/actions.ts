"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function makeInviteCode(title: string) {
  const base = title.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 8);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}${rand}`;
}

export async function createEvent(formData: FormData) {
  const title = String(formData.get("title") || "");
  const type = String(formData.get("type") || "other");
  const start_date = formData.get("start_date") || null;
  const end_date = formData.get("end_date") || null;
  const location = String(formData.get("location") || "");

  const supabase = await createClient();
  
  // Get the session to verify auth
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log("Session exists:", !!session, "User:", session?.user?.id);
  
  if (sessionError || !session?.user) {
    console.error("Session error:", sessionError);
    redirect("/login");
  }

  const invite_code = makeInviteCode(title);

  console.log("Attempting to insert event:", { title, type, owner_id: session.user.id });

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      title,
      type,
      start_date,
      end_date,
      location,
      invite_code,
      owner_id: session.user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Insert event error:", error);
    redirect(`/events?error=${encodeURIComponent(error.message)}`);
  }

  console.log("Event created successfully:", event.id);

  // Creator becomes owner member
  const { error: memberError } = await supabase.from("event_members").insert({
    event_id: event.id,
    user_id: session.user.id,
    role: "owner",
  });

  if (memberError) {
    console.error("Insert member error:", memberError);
    redirect(`/events?error=${encodeURIComponent(memberError.message)}`);
  }

  console.log("Member added successfully");
  redirect(`/events/${event.id}`);
}

export async function joinEvent(formData: FormData) {
  const invite_code = String(formData.get("invite_code") || "").toUpperCase();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event, error: eventErr } = await supabase
    .from("events")
    .select("id")
    .eq("invite_code", invite_code)
    .single();

  if (eventErr || !event) {
    redirect(`/events?error=${encodeURIComponent("Invalid invite code")}`);
  }

  const { error } = await supabase.from("event_members").insert({
    event_id: event.id,
    user_id: user.id,
    role: "member",
  });

  if (error) {
    redirect(`/events?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/events/${event.id}`);
}
