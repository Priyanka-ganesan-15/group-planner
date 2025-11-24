import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Member = {
  user_id: string;
  profiles?: { name: string | null; email: string | null } | null;
};

export default function WorkloadCard({
  members,
  taskCounts,
}: {
  members: Member[];
  taskCounts: Record<string, number>;
}) {
  const unassignedCount = taskCounts["unassigned"] ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Workload</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {members.map(m => {
          const name = m.profiles?.name ?? "Member";
          const initials = name.slice(0,1).toUpperCase();
          const count = taskCounts[m.user_id] ?? 0;
          return (
            <div key={m.user_id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {count} tasks
              </span>
            </div>
          );
        })}
        
        {unassignedCount > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">Unassigned</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {unassignedCount} tasks
            </span>
          </div>
        )}

        {members.length === 0 && unassignedCount === 0 && (
          <div className="text-sm text-muted-foreground italic">No members yet</div>
        )}
      </CardContent>
    </Card>
  );
}
