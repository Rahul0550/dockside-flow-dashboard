
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { MoreVertical } from "lucide-react";
import { DockStatus } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface DockCardHeaderProps {
  displayName: string;
  status: DockStatus;
  statusLabel: string;
  isBlocked: boolean;
  onBlockRequest: () => void;
  productType?: string | null;
}

export function DockCardHeader({ 
  displayName, 
  status, 
  statusLabel,
  isBlocked,
  onBlockRequest,
  productType
}: DockCardHeaderProps) {
  const getStatusBadge = (status: string) => {
    if (isBlocked)
      return "status-badge bg-red-100 text-red-800 border border-red-200";

    switch (status) {
      case "AVAILABLE":
        return "status-badge status-available";
      case "OCCUPIED":
        return "status-badge status-occupied";
      case "UNDER_MAINTENANCE":
        return "status-badge status-maintenance";
      default:
        return "status-badge";
    }
  };

  const getProductTypeBadge = (type: string | null | undefined) => {
    if (!type) return "";
    
    switch (type.toLowerCase()) {
      case "frozen":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "dry":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "fresh":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-purple-100 text-purple-800 border border-purple-200";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg font-bold">{displayName}</CardTitle>
        <div className="flex items-center gap-2">
          <span className={getStatusBadge(status)}>{statusLabel}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48">
                    <ContextMenuItem
                      onClick={onBlockRequest}
                      disabled={status === "OCCUPIED"}
                      className="cursor-pointer"
                    >
                      {isBlocked ? "Unblock Dock" : "Block Dock"}
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Dock Options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {productType && (
        <div>
          <Badge className={`text-xs font-normal ${getProductTypeBadge(productType)}`}>
            {productType}
          </Badge>
        </div>
      )}
    </div>
  );
}
