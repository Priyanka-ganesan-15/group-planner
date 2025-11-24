"use client";

import { useTransition } from "react";
import { setCurrentEvent } from "@/app/(dashboard)/events/setCurrentEventAction";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

type SwitcherEvent = {
  id: string;
  title: string;
};

export default function EventSwitcher({
  events,
  currentEventId,
}: {
  events: SwitcherEvent[];
  currentEventId: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const current = events.find(e => e.id === currentEventId) ?? events[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2" disabled={pending}>
          <span className="font-medium">{current?.title ?? "Select Event"}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {events.map(e => (
          <DropdownMenuItem
            key={e.id}
            onClick={() =>
              startTransition(async () => {
                await setCurrentEvent(e.id);
              })
            }
            className="flex items-center justify-between"
          >
            <span>{e.title}</span>
            {currentEventId === e.id && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
        {events.length === 0 && (
          <DropdownMenuItem disabled>No events yet</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
