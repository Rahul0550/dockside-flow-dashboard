
import { Button } from "@/components/ui/button";
import { DockStatus } from "@/lib/data";

interface DockCardActionsProps {
  status: DockStatus;
  isBlocked: boolean;
}

export function DockCardActions({ status, isBlocked }: DockCardActionsProps) {
  return (
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
  );
}
