
import { useState } from "react";
import { DockCardHeader } from "./DockCardHeader";
import { DockCardContent } from "./DockCardContent";
import { DockCardFooter } from "./DockCardFooter";
import { Card } from "../ui/card";
import { DockDoor } from "@/lib/data";
import { blockDock } from "@/lib/supabase/dockOperations";
import { toast } from "sonner";

export interface DockDoorCardProps {
  id?: string;
  name?: string;
  status?: "AVAILABLE" | "OCCUPIED" | "UNDER_MAINTENANCE";
  assignedTruck?: string;
  lastUpdated?: string;
  estimatedCompletion?: string;
  className?: string;
  dock?: DockDoor; // When dock is provided, the other props become optional
}

export function DockDoorCard({ 
  id, 
  name, 
  status, 
  assignedTruck, 
  lastUpdated, 
  estimatedCompletion,
  className,
  dock
}: DockDoorCardProps) {
  // If dock is provided, use its properties, otherwise use the direct props
  const dockId = dock?.id || id || "";
  const dockName = dock?.dock_name || name || "";
  const dockStatus = dock?.status || status || "AVAILABLE";
  const dockAssignedTruck = dock?.assignedTruck || assignedTruck;
  const dockLastUpdated = dock?.lastUpdated || lastUpdated || new Date().toISOString();
  const dockEstimatedCompletion = dock?.estimatedCompletion || estimatedCompletion;
  
  // Track blocked status
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const getDisplayName = () => {
    return dockName || `Dock ${dockId}`;
  };
  
  const getStatusLabel = () => {
    if (isBlocked) return "Blocked";
    return dockStatus;
  };
  
  const handleBlockRequest = async () => {
    try {
      setIsLoading(true);
      // Update isBlocked state immediately for UI feedback
      const newBlockedState = !isBlocked;
      setIsBlocked(newBlockedState);
      
      // Call the blockDock API function
      await blockDock(dockId, newBlockedState);
      
      toast.success(`Dock ${newBlockedState ? 'blocked' : 'unblocked'} successfully`);
    } catch (error) {
      console.error("Error blocking/unblocking dock:", error);
      toast.error(`Failed to ${isBlocked ? 'unblock' : 'block'} dock`);
      // Revert the state if the API call failed
      setIsBlocked(!isBlocked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`overflow-hidden flex flex-col h-full ${className}`}>
      <div className="p-4 pb-0">
        <DockCardHeader 
          displayName={getDisplayName()}
          status={dockStatus}
          statusLabel={getStatusLabel()}
          isBlocked={isBlocked}
          onBlockRequest={handleBlockRequest}
        />
      </div>
      
      <div className="p-4">
        <DockCardContent 
          dock={{
            id: dockId,
            dock_name: dockName,
            status: dockStatus,
            assignedTruck: dockAssignedTruck,
            lastUpdated: dockLastUpdated,
            estimatedCompletion: dockEstimatedCompletion
          }}
          isBlocked={isBlocked} 
        />
      </div>
      
      <div className="mt-auto">
        <DockCardFooter 
          dockId={dockId}
          status={dockStatus} 
          assignedTruck={dockAssignedTruck} 
          estimatedCompletion={dockEstimatedCompletion} 
        />
      </div>
    </Card>
  );
}
