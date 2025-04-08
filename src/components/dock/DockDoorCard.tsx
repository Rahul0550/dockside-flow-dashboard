
import { DockCardHeader } from "./DockCardHeader";
import { DockCardContent } from "./DockCardContent";
import { DockCardFooter } from "./DockCardFooter";
import { Card } from "../ui/card";

export interface DockDoorCardProps {
  id: string;
  name: string;
  status: "Available" | "Occupied" | "Maintenance";
  assignedTruck?: string;
  lastUpdated: string;
  estimatedCompletion?: string;
  className?: string;
}

export function DockDoorCard({ 
  id, 
  name, 
  status, 
  assignedTruck, 
  lastUpdated, 
  estimatedCompletion,
  className 
}: DockDoorCardProps) {
  return (
    <Card className={`overflow-hidden flex flex-col h-full ${className}`}>
      <DockCardHeader 
        id={id} 
        name={name} 
        status={status} 
        lastUpdated={lastUpdated} 
      />
      <DockCardContent 
        status={status} 
        assignedTruck={assignedTruck} 
      />
      <div className="mt-auto">
        <DockCardFooter 
          dockId={id}
          status={status} 
          assignedTruck={assignedTruck} 
          estimatedCompletion={estimatedCompletion} 
        />
      </div>
    </Card>
  );
}
