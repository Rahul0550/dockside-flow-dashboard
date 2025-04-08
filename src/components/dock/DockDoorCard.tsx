
import { useState } from "react";
import { DockCardHeader } from "./DockCardHeader";
import { DockCardContent } from "./DockCardContent";
import { DockCardFooter } from "./DockCardFooter";
import { Card } from "../ui/card";
import { DockDoor } from "@/lib/data";

export interface DockDoorCardProps {
  id?: string;
  name?: string;
  status?: "Available" | "Occupied" | "Maintenance";
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
  const dockStatus = dock?.status || status || "Available";
  const dockAssignedTruck = dock?.assignedTruck || assignedTruck;
  const dockLastUpdated = dock?.lastUpdated || lastUpdated || new Date().toISOString();
  const dockEstimatedCompletion = dock?.estimatedCompletion || estimatedCompletion;
  
  // Track blocked status
  const [isBlocked, setIsBlocked] = useState(false);
  
  const getDisplayName = () => {
    return dockName || `Dock ${dockId}`;
  };
  
  const getStatusLabel = () => {
    if (isBlocked) return "Blocked";
    return dockStatus;
  };
  
  const handleBlockRequest = () => {
    setIsBlocked(prev => !prev);
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
