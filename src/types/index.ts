export type EventType = "trip" | "party" | "hangout" | "other";
export type TaskStatus = "todo" | "doing" | "done";

export type Member = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type Event = {
  id: string;
  title: string;
  type: EventType;
  startDate: string;
  endDate: string;
  location: string;
  inviteCode: string;
  members: Member[];
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
};
