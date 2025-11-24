"use client";

import * as React from "react";
import { useTransition } from "react";
import { createTask } from "@/app/(dashboard)/tasks/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function CreateTaskDialog() {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      await createTask(formData);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>

        <form action={onSubmit} className="space-y-3">
          <Input name="title" placeholder="Task title" required />
          <Input name="description" placeholder="Description (optional)" />
          <div className="grid grid-cols-2 gap-2">
            <Input name="due_date" type="date" />
            <select
              name="priority"
              className="w-full border rounded-md h-10 px-3 text-sm bg-background"
              defaultValue=""
            >
              <option value="">Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
