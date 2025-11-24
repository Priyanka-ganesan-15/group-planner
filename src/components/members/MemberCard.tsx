"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, UserMinus } from "lucide-react";
import { removeMember, updateMemberRole } from "@/app/(dashboard)/members/actions";

type MemberRow = {
  user_id: string;
  role: "owner" | "admin" | "member";
  profiles?: {
    name: string | null;
    email: string | null;
  } | null;
  isMe: boolean;
  canManage: boolean; // current user is owner/admin
};

export default function MemberCard({ m }: { m: MemberRow }) {
  const [pending, startTransition] = useTransition();
  const name = m.profiles?.name ?? "Member";
  const email = m.profiles?.email ?? "";
  const initials = name.slice(0, 1).toUpperCase();

  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium flex items-center gap-2">
              {name}
              {m.role !== "member" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                  {m.role}
                </span>
              )}
              {m.isMe && <span className="text-xs text-muted-foreground">(you)</span>}
            </div>
            {email && <div className="text-xs text-muted-foreground">{email}</div>}
          </div>
        </div>

        {m.canManage && m.role !== "owner" && (
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="secondary" disabled={pending}>
                  <Shield className="h-4 w-4 mr-1" />
                  Role
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    startTransition(() => updateMemberRole(m.user_id, "member"))
                  }
                >
                  Member
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    startTransition(() => updateMemberRole(m.user_id, "admin"))
                  }
                >
                  Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <form
              action={() =>
                startTransition(async () => removeMember(m.user_id))
              }
            >
              <Button size="icon" variant="ghost" disabled={pending} title="Remove">
                <UserMinus className="h-4 w-4 text-red-600" />
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
