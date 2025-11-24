import { createClient } from "@/lib/supabase/server";
import { joinByInviteCode } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function InvitePage({
  params,
}: {
  params: { code: string };
}) {
  const supabase = await createClient();
  const inviteCode = params.code.toUpperCase();

  // Fetch a safe preview of event
  const { data: event } = await supabase
    .from("events")
    .select("id,title,location,start_date,end_date,invite_code,created_at")
    .eq("invite_code", inviteCode)
    .maybeSingle();

  const { data: members } = event
    ? await supabase
        .from("event_members")
        .select("id")
        .eq("event_id", event.id)
    : { data: null };

  const memberCount = members?.length ?? 0;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid invite</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            This invite code doesn&apos;t match any event.
            <Link href="/events" className="underline text-foreground block">
              Go to My Events
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If logged in, auto-join immediately
  if (user) {
    // This will redirect on success
    await joinByInviteCode(inviteCode);
  }

  const nextParam = encodeURIComponent(`/invite/${inviteCode}`);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl">
            You&apos;re invited to join:
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="text-2xl font-semibold tracking-tight">
              {event.title}
            </div>
            {event.location && (
              <div className="text-muted-foreground">
                {event.location}
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              {event.start_date ?? ""} → {event.end_date ?? ""}
            </div>
            <div className="text-sm">
              Members: <span className="font-medium">{memberCount}</span>
            </div>
          </div>

          <div className="rounded-lg border p-3 text-sm bg-background">
            Invite code:{" "}
            <span className="font-semibold">{event.invite_code}</span>
          </div>

          <div className="space-y-2">
            <Link href={`/login?next=${nextParam}`}>
              <Button className="w-full">Log in to join</Button>
            </Link>
            <Link href={`/signup?next=${nextParam}`}>
              <Button className="w-full" variant="secondary">
                Sign up to join
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            After logging in, you&apos;ll be added automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
