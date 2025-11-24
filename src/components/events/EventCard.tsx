import { Event } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EventCard({ event }: { event: Event }) {
  return (
    <Card className="hover:shadow-md transition">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <CardDescription>{event.location}</CardDescription>
          </div>
          <Badge variant="secondary" className="capitalize">
            {event.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {event.startDate} → {event.endDate}
        <div className="mt-2">
          Invite code:{" "}
          <span className="font-medium text-foreground">
            {event.inviteCode}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
