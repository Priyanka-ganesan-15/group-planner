import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EventSummaryCard({ event }: { event: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Event</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <div className="font-medium">{event.title}</div>
        {event.location && <div className="text-muted-foreground">{event.location}</div>}
        <div>
          {(event.start_date ?? "")} → {(event.end_date ?? "")}
        </div>
        <div className="pt-2 text-xs text-muted-foreground">
          Invite code:{" "}
          <span className="font-semibold text-foreground">{event.invite_code}</span>
        </div>
      </CardContent>
    </Card>
  );
}
