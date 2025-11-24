"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentEventId } from "@/lib/currentEvent";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTask(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "");
  const due_date = formData.get("due_date") || null;
  const priority = formData.get("priority") || null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const eventId = await getCurrentEventId();
  if (!eventId) throw new Error("No current event.");

  const { error } = await supabase.from("tasks").insert({
    event_id: eventId,
    title,
    description,
    due_date,
    priority,
    status: "todo",
    created_by: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
  revalidatePath(`/events/${eventId}`);
}

export async function updateTask(taskId: string, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "");
  const due_date = formData.get("due_date") || null;
  const priority = formData.get("priority") || null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ title, description, due_date, priority })
    .eq("id", taskId);

  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
}

export async function moveTask(taskId: string, status: "todo"|"doing"|"done") {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId);

  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
}

export async function updateAssignee(taskId: string, assigneeId: string | null) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .update({ assignee_id: assigneeId })
    .eq("id", taskId);

  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
  revalidatePath("/");
}
