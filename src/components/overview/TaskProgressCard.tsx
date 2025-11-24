import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function TaskProgressCard({
  done,
  total,
}: {
  done: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Task Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>{done} / {total} done</span>
          <span className="font-medium">{pct}%</span>
        </div>
        <Progress value={pct} />
        <div className="text-xs text-muted-foreground">
          Drag tasks on the board to update status.
        </div>
      </CardContent>
    </Card>
  );
}
