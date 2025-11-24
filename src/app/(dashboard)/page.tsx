import { createClient } from "@/lib/supabase/server";
import { getCurrentEventId } from "@/lib/currentEvent";
import EventSummaryCard from "@/components/overview/EventSummaryCard";
import TaskProgressCard from "@/components/overview/TaskProgressCard";
import DueSoonCard from "@/components/overview/DueSoonCard";
import WorkloadCard from "@/components/overview/WorkloadCard";
import { seedDemoTasks } from "./seed/actions";
import { Button } from "@/components/ui/button";

export default async function OverviewPage() {
  const supabase = await createClient();
  const eventId = await getCurrentEventId();

  if (!eventId) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Create or join an event to start planning.</p>
      </div>
    );
  }

  const { data: { user } } = await supabase.auth.getUser();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  const { data: members } = await supabase
    .from("event_members")
    .select("user_id, role, profiles(name,email)")
    .eq("event_id", eventId);

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("event_id", eventId);

  const total = tasks?.length ?? 0;
  const done = tasks?.filter(t => t.status === "done").length ?? 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in7Days = new Date(today);
  in7Days.setDate(today.getDate() + 7);

  const overdue = (tasks ?? []).filter(t => t.due_date && new Date(t.due_date) < today && t.status !== "done");
  const dueSoon = (tasks ?? []).filter(t => {
    if (!t.due_date) return false;
    const d = new Date(t.due_date);
    return d >= today && d <= in7Days && t.status !== "done";
  });

  const taskCounts: Record<string, number> = {};
  (tasks ?? []).forEach(t => {
    const a = t.assignee_id ?? "unassigned";
    taskCounts[a] = (taskCounts[a] ?? 0) + 1;
  });

  const myRole = members?.find(m => m.user_id === user?.id)?.role ?? "member";
  const canSeed = (myRole === "owner" || myRole === "admin") && total === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">
            Snapshot of your selected event.
          </p>
        </div>
        {canSeed && (
          <form action={seedDemoTasks}>
            <Button variant="secondary">Seed demo tasks</Button>
          </form>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {event && <EventSummaryCard event={event} />}
        <TaskProgressCard done={done} total={total} />
        <WorkloadCard members={members ?? []} taskCounts={taskCounts} />
      </div>

      <DueSoonCard dueSoon={dueSoon} overdue={overdue} />
    </div>
  );
}
