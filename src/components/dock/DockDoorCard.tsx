
import { DockDoor } from "@/lib/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { BlockDockDialog } from "./BlockDockDialog";
import { DockCardHeader } from "./DockCardHeader";
import { DockCardContent } from "./DockCardContent";
import { DockCardFooter } from "./DockCardFooter";
import { useState } from "react";
import { toast } from "sonner";

interface DockDoorCardProps {
  dock: DockDoor;
}

export function DockDoorCard({ dock }: DockDoorCardProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [showBlockConfirmation, setShowBlockConfirmation] = useState(false);

  const handleBlockDockRequest = () => {
    if (dock.status === "Occupied") {
      toast.error("Cannot block an occupied dock");
      return;
    }

    setShowBlockConfirmation(true);
  };

  const handleConfirmBlock = () => {
    setIsBlocked((prev) => !prev);
    setShowBlockConfirmation(false);
    toast.success(
      isBlocked ? "Dock unblocked successfully" : "Dock blocked successfully"
    );
  };

  const handleCancelBlock = () => {
    setShowBlockConfirmation(false);
  };

  const statusLabel = isBlocked ? "Blocked" : dock.status;
  const displayName = dock.dock_name || dock.name || "Unknown Dock";

  const getStatusClass = (status: string) => {
    if (isBlocked)
      return "bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-red-500";

    switch (status) {
      case "Available":
        return "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500";
      case "Occupied":
        return "bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500";
      case "Maintenance":
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-500";
      default:
        return "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500";
    }
  };

  return (
    <>
      <Card
        className={`${getStatusClass(
          dock.status
        )} shadow-sm hover:shadow-md transition-all`}
      >
        <CardHeader className="pb-2">
          <DockCardHeader 
            displayName={displayName} 
            status={dock.status} 
            statusLabel={statusLabel} 
            isBlocked={isBlocked}
            onBlockRequest={handleBlockDockRequest}
          />
        </CardHeader>
        
        <CardContent className="pb-1">
          <DockCardContent 
            dock={dock} 
            isBlocked={isBlocked} 
          />
        </CardContent>

        <CardFooter className="flex flex-col pt-0 space-y-2">
          <DockCardFooter 
            lastUpdated={dock.lastUpdated} 
            status={dock.status}
            isBlocked={isBlocked}
          />
        </CardFooter>
      </Card>

      <BlockDockDialog
        open={showBlockConfirmation}
        onOpenChange={setShowBlockConfirmation}
        onConfirm={handleConfirmBlock}
        onCancel={handleCancelBlock}
        displayName={displayName}
        isBlocked={isBlocked}
      />
    </>
  );
}
