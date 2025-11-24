import { Event, Task } from "@/types";

export const mockEvents: Event[] = [
  {
    id: "e1",
    title: "Austin Weekend Trip",
    type: "trip",
    startDate: "2025-12-12",
    endDate: "2025-12-15",
    location: "Austin, TX",
    inviteCode: "AUSTIN25",
    members: [
      { id: "u1", name: "Priyanka" },
      { id: "u2", name: "Ava" },
      { id: "u3", name: "Ravi" },
    ],
  },
  {
    id: "e2",
    title: "Friendsgiving Potluck",
    type: "party",
    startDate: "2025-11-28",
    endDate: "2025-11-28",
    location: "Richardson, TX",
    inviteCode: "FOODIE28",
    members: [
      { id: "u1", name: "Priyanka" },
      { id: "u4", name: "Jen" },
      { id: "u5", name: "Omar" },
    ],
  },
];

export const mockTasks: Task[] = [
  {
    id: "t1",
    title: "Book Airbnb",
    description: "Find a 3-bedroom near downtown",
    status: "doing",
    assigneeId: "u1",
    dueDate: "2025-12-01",
    priority: "high",
  },
  {
    id: "t2",
    title: "Plan itinerary",
    status: "todo",
    assigneeId: "u2",
    dueDate: "2025-12-05",
    priority: "medium",
  },
  {
    id: "t3",
    title: "Grocery list",
    status: "done",
    assigneeId: "u3",
    priority: "low",
  },
];
