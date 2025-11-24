import { createClient } from "@/lib/supabase/server";
import TaskBoard from "@/components/tasks/TaskBoard";
import { getCurrentEventId } from "@/lib/currentEvent";
import { getCurrentEventMembers } from "@/lib/members";
import CreateTaskDialog from "@/components/tasks/CreateTaskDialog";

export default async function TasksPage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const eventId = await getCurrentEventId();

  if (!eventId) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Responsibilities</h1>
        <p className="text-muted-foreground">Join or create an event first.</p>
      </div>
    );
  }

  // Verify user is a member of this event
  const { data: membership } = await supabase
    .from("event_members")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Access Denied</h1>
        <p className="text-muted-foreground">You are not a member of this event.</p>
      </div>
    );
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  const members = await getCurrentEventMembers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Responsibilities</h1>
          <p className="text-muted-foreground">Tasks for your current event.</p>
        </div>
        <CreateTaskDialog />
      </div>

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
        members={members.map(m => ({
          user_id: m.user_id,
          profiles: Array.isArray(m.profiles) ? m.profiles[0] : m.profiles
        }))}
      />
    </div>
  );
}
