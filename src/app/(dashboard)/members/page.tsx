import { createClient } from "@/lib/supabase/server";
import { getCurrentEventId } from "@/lib/currentEvent";
import MemberCard from "@/components/members/MemberCard";
import InviteBox from "@/components/members/InviteBox";

export default async function MembersPage() {
  const supabase = await createClient();
  const eventId = await getCurrentEventId();

  if (!eventId) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Members</h1>
        <p className="text-muted-foreground">Join or create an event first.</p>
      </div>
    );
  }

  const { data: { user } } = await supabase.auth.getUser();

  const { data: event } = await supabase
    .from("events")
    .select("id,title,invite_code")
    .eq("id", eventId)
    .single();

  const { data: members } = await supabase
    .from("event_members")
    .select("user_id, role, profiles(name,email)")
    .eq("event_id", eventId)
    .order("joined_at", { ascending: true });

  const myRole =
    members?.find((m) => m.user_id === user?.id)?.role ?? "member";
  const canManage = myRole === "owner" || myRole === "admin";

  const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"}/invite/${event?.invite_code}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Members</h1>
        <p className="text-muted-foreground">
          People planning {event?.title}.
        </p>
      </div>

      <InviteBox inviteCode={event?.invite_code ?? ""} inviteLink={inviteLink} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(members ?? []).map((m) => (
          <MemberCard
            key={m.user_id}
            m={{
              user_id: m.user_id,
              role: m.role,
              profiles: Array.isArray(m.profiles) ? m.profiles[0] : m.profiles,
              isMe: m.user_id === user?.id,
              canManage,
            }}
          />
        ))}
      </div>
    </div>
  );
}
