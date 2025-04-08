
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DockStatus } from "@/lib/data";

interface DockCardFooterProps {
  lastUpdated: string;
  status: DockStatus;
  isBlocked: boolean;
}

export function DockCardFooter({ 
  lastUpdated, 
  status,
  isBlocked 
}: DockCardFooterProps) {
  const formattedTime = lastUpdated
    ? formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })
    : "N/A";

  return (
    <>
      <div className="flex items-center gap-1 text-xs text-muted-foreground w-full">
        <Clock className="h-3 w-3" />
        <span>Updated {formattedTime}</span>
      </div>

      <div className="flex gap-2 w-full">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 text-xs font-medium"
          disabled={status === "Maintenance" || isBlocked}
        >
          Dock In
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs font-medium"
          disabled={status !== "Occupied"}
        >
          Dock Out
        </Button>
      </div>
    </>
  );
}
