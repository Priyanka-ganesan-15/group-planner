"use client";

import { Task } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, UserCircle2 } from "lucide-react";
import { deleteTask } from "@/app/(dashboard)/tasks/actions";
import EditTaskDialog from "./EditTaskDialog";

const statusStyles: Record<Task["status"], string> = {
  todo: "bg-muted",
  doing: "bg-blue-500/10 text-blue-700",
  done: "bg-green-500/10 text-green-700",
};

type Member = {
  user_id: string;
  profiles?: { name: string | null; email: string | null } | null;
};

export default function TaskCard({
  task,
  members,
}: {
  task: Task;
  members: Member[];
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const assignee = members.find(m => m.user_id === task.assigneeId);
  const assigneeName = assignee?.profiles?.name ?? assignee?.profiles?.email ?? null;
  const initials = assigneeName?.slice(0,1).toUpperCase();

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card cursor-grab active:cursor-grabbing",
        isDragging && "opacity-70"
      )}
      {...listeners}
      {...attributes}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-medium">{task.title}</div>
            {task.description && (
              <p className="text-sm text-muted-foreground">{task.description}</p>
            )}
          </div>

          <Badge className={statusStyles[task.status]} variant="secondary">
            {task.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {task.dueDate ? `Due ${task.dueDate}` : ""}
            <span className="flex items-center gap-1">
              <UserCircle2 className="h-3.5 w-3.5" />
              {assigneeName ? (
                <span className="font-medium text-foreground">{initials}</span>
              ) : (
                <span>Unassigned</span>
              )}
            </span>
          </div>

          <div className="flex gap-1">
            <EditTaskDialog task={task} members={members}>
              <Button size="icon" variant="ghost">
                <Pencil className="h-4 w-4" />
              </Button>
            </EditTaskDialog>

            <form action={() => deleteTask(task.id)}>
              <Button size="icon" variant="ghost" type="submit">
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
