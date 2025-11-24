import { createClient } from "@/lib/supabase/server";
import EventCard from "@/components/events/EventCard";
import { createEvent, joinEvent } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: { error?: string; code?: string };
}) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Only get events where user is a member
  const { data: events } = await supabase
    .from("events")
    .select("*, event_members!inner(user_id, role)")
    .eq("event_members.user_id", user.id)
    .order("created_at", { ascending: false });

  const inviteCodeFromURL = searchParams?.code ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Events</h1>
        <p className="text-muted-foreground">
          Create, join, and manage your group plans.
        </p>
      </div>

      {searchParams?.error && (
        <p className="text-sm text-red-600">{searchParams.error}</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createEvent} className="space-y-3">
              <Input name="title" placeholder="Event name" required />
              <Input name="location" placeholder="Location (optional)" />
              <div className="grid grid-cols-2 gap-2">
                <Input name="start_date" type="date" />
                <Input name="end_date" type="date" />
              </div>
              <select
                name="type"
                className="w-full border rounded-md h-10 px-3 text-sm bg-background"
                defaultValue="other"
              >
                <option value="trip">Trip</option>
                <option value="party">Party</option>
                <option value="hangout">Hangout</option>
                <option value="other">Other</option>
              </select>
              <Button className="w-full" type="submit">
                Create
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Join with Invite Code</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={joinEvent} className="space-y-3">
              <Input 
                name="invite_code" 
                placeholder="Invite code" 
                defaultValue={inviteCodeFromURL}
                required 
              />
              <Button className="w-full" variant="secondary" type="submit">
                Join
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events?.map((e) => (
          <EventCard
            key={e.id}
            event={{
              id: e.id,
              title: e.title,
              type: e.type as "trip" | "party" | "hangout" | "other",
              startDate: e.start_date ?? "",
              endDate: e.end_date ?? "",
              location: e.location ?? "",
              inviteCode: e.invite_code,
              members: [],
            }}
          />
        ))}
        {events?.length === 0 && (
          <p className="text-sm text-muted-foreground">No events yet.</p>
        )}
      </div>
    </div>
  );
}
