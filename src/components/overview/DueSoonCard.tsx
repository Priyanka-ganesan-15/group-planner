import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DueSoonCard({
  dueSoon,
  overdue,
}: {
  dueSoon: any[];
  overdue: any[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Deadlines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <div className="font-medium mb-2">Overdue</div>
          {overdue.length === 0 && (
            <div className="text-muted-foreground italic">None 🎉</div>
          )}
          <ul className="space-y-2">
            {overdue.map(t => (
              <li key={t.id} className="flex items-center justify-between">
                <span>{t.title}</span>
                <Badge variant="destructive">
                  {t.due_date}
                </Badge>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-medium mb-2">Due soon (7 days)</div>
          {dueSoon.length === 0 && (
            <div className="text-muted-foreground italic">Nothing urgent</div>
          )}
          <ul className="space-y-2">
            {dueSoon.map(t => (
              <li key={t.id} className="flex items-center justify-between">
                <span>{t.title}</span>
                <Badge variant="secondary">
                  {t.due_date}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
