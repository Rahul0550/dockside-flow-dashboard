
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { MoreVertical } from "lucide-react";
import { DockStatus } from "@/lib/data";

interface DockCardHeaderProps {
  displayName: string;
  status: DockStatus;
  statusLabel: string;
  isBlocked: boolean;
  onBlockRequest: () => void;
}

export function DockCardHeader({ 
  displayName, 
  status, 
  statusLabel,
  isBlocked,
  onBlockRequest 
}: DockCardHeaderProps) {
  const getStatusBadge = (status: string) => {
    if (isBlocked)
      return "status-badge bg-red-100 text-red-800 border border-red-200";

    switch (status) {
      case "Available":
        return "status-badge status-available";
      case "Occupied":
        return "status-badge status-occupied";
      case "Maintenance":
        return "status-badge status-maintenance";
      default:
        return "status-badge";
    }
  };

  return (
    <div className="flex justify-between items-center">
      <CardTitle className="text-lg font-bold">{displayName}</CardTitle>
      <div className="flex items-center gap-2">
        <span className={getStatusBadge(status)}>{statusLabel}</span>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={onBlockRequest}
              disabled={status === "Occupied"}
            >
              {isBlocked ? "Unblock Dock" : "Block Dock"}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </div>
  );
}
