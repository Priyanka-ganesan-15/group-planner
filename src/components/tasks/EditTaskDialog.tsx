"use client";

import * as React from "react";
import { useTransition } from "react";
import { Task } from "@/types";
import { updateTask, updateAssignee } from "@/app/(dashboard)/tasks/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type MemberOption = {
  user_id: string;
  profiles?: { name: string | null; email: string | null } | null;
};

export default function EditTaskDialog({
  task,
  members,
  children,
}: {
  task: Task;
  members: MemberOption[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      await updateTask(task.id, formData);

      const assignee = String(formData.get("assignee_id") || "");
      await updateAssignee(task.id, assignee === "" ? null : assignee);

      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <form action={onSubmit} className="space-y-3">
          <Input name="title" defaultValue={task.title} required />
          <Input name="description" defaultValue={task.description ?? ""} />

          <div className="grid grid-cols-2 gap-2">
            <Input name="due_date" type="date" defaultValue={task.dueDate ?? ""} />
            <select
              name="priority"
              className="w-full border rounded-md h-10 px-3 text-sm bg-background"
              defaultValue={task.priority ?? ""}
            >
              <option value="">Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <select
            name="assignee_id"
            className="w-full border rounded-md h-10 px-3 text-sm bg-background"
            defaultValue={task.assigneeId ?? ""}
          >
            <option value="">Unassigned</option>
            {members.map((m) => {
              const label = m.profiles?.name ?? m.profiles?.email ?? m.user_id;
              return (
                <option key={m.user_id} value={m.user_id}>
                  {label}
                </option>
              );
            })}
          </select>

          <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
