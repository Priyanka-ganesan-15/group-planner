"use client";

import * as React from "react";
import { Task } from "@/types";
import TaskCard from "./TaskCard";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { moveTask } from "@/app/(dashboard)/tasks/actions";

const columns: { key: Task["status"]; title: string }[] = [
  { key: "todo", title: "To do" },
  { key: "doing", title: "Doing" },
  { key: "done", title: "Done" },
];

type Member = {
  user_id: string;
  profiles?: { name: string | null; email: string | null } | null;
};

export default function TaskBoard({
  tasks,
  members,
}: {
  tasks: Task[];
  members: Member[];
}) {
  const [localTasks, setLocalTasks] = React.useState(tasks);

  React.useEffect(() => setLocalTasks(tasks), [tasks]);

  async function handleDragEnd(e: DragEndEvent) {
    const taskId = e.active.id as string;
    const newStatus = e.over?.id as Task["status"] | undefined;
    if (!newStatus) return;

    const old = localTasks.find(t => t.id === taskId);
    if (!old || old.status === newStatus) return;

    setLocalTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    await moveTask(taskId, newStatus);
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid md:grid-cols-3 gap-4">
        {columns.map(col => (
          <KanbanColumn
            key={col.key}
            id={col.key}
            title={col.title}
            tasks={localTasks.filter(t => t.status === col.key)}
            members={members}
          />
        ))}
      </div>
    </DndContext>
  );
}

function KanbanColumn({
  id,
  title,
  tasks,
  members,
}: {
  id: Task["status"];
  title: string;
  tasks: Task[];
  members: Member[];
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="space-y-3">
      <div className="font-semibold text-sm">{title}</div>

      <div
        ref={setNodeRef}
        className="space-y-2 min-h-[120px] rounded-lg border bg-muted/20 p-2"
      >
        {tasks.map(task => (
          <div key={task.id}>
            <TaskCard task={task} members={members} />
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-sm text-muted-foreground italic px-1 py-2">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
