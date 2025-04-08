
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function AverageDockTime() {
  // In a real app, this would be calculated from actual data
  const averageTime = "1h 45m";
  
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-cyan-100">
      <CardContent className="pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100/80 text-blue-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Average Dock Time</h3>
            <p className="text-2xl font-bold text-blue-700">{averageTime}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
