import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, LogOut, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";
import { getCurrentEventId } from "@/lib/currentEvent";
import EventSwitcher from "./EventSwitcher";
import Link from "next/link";

export default async function Topbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    (user?.user_metadata?.name as string) || user?.email || "User";

  const currentEventId = await getCurrentEventId();

  // fetch events user belongs to
  const { data: events } = await supabase
    .from("events")
    .select("id, title, event_members!inner(user_id)")
    .eq("event_members.user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        <EventSwitcher
          events={(events ?? []).map(e => ({ id: e.id, title: e.title }))}
          currentEventId={currentEventId}
        />

        <div className="flex items-center gap-2">
          <Link href="/events">
            <Button size="sm" className="gap-2" variant="secondary">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <UserCircle className="h-5 w-5" />
                <span className="hidden sm:inline">{displayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <form action={signOut}>
                  <button className="flex items-center gap-2 w-full">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
