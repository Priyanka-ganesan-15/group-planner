import { createClient } from "@/lib/supabase/server";
import TaskBoard from "@/components/tasks/TaskBoard";
import CreateTaskDialog from "@/components/tasks/CreateTaskDialog";

export default async function SingleEventPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const eventId = params.id;

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Verify user is a member of this event
  const { data: membership } = await supabase
    .from("event_members")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Access Denied</h1>
        <p className="text-muted-foreground">
          You are not a member of this event.
        </p>
      </div>
    );
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  // Use RPC function to get all members
  const { data: members } = await supabase
    .rpc("get_event_members", { p_event_id: eventId });

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {event?.title ?? "Event"}
        </h1>
        <p className="text-muted-foreground">
          {event?.location} • {event?.start_date ?? ""} → {event?.end_date ?? ""}
        </p>
        <p className="text-sm mt-2">
          Invite code: <span className="font-semibold">{event?.invite_code}</span>
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Tasks</h2>
        <CreateTaskDialog />
      </div>

      <div>
        <TaskBoard
          tasks={(tasks ?? []).map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description ?? "",
            status: t.status as "todo" | "doing" | "done",
            assigneeId: t.assignee_id ?? undefined,
            dueDate: t.due_date ?? undefined,
            priority: t.priority as "low" | "medium" | "high" | undefined,
          }))}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        Members count: {members?.length ?? 0}
      </div>
    </div>
  );
}
