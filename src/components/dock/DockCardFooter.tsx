
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useState } from "react";
import { dockInVehicle, dockOutVehicle } from "@/lib/supabase/dockOperations";
import { toast } from "sonner";

interface DockCardFooterProps {
  dockId: string;
  status: string;
  assignedTruck?: string;
  estimatedCompletion?: string;
}

export function DockCardFooter({ dockId, status, assignedTruck, estimatedCompletion }: DockCardFooterProps) {
  const [isLoading, setIsLoading] = useState(false);

  // For this demo, we're using a hardcoded shipment code for the dock in operation
  // In a real scenario, you would select a shipment from a list
  const handleDockIn = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, you would show a dialog to select a shipment
      const demoShipmentCode = "SHIP-001";
      await dockInVehicle(dockId, demoShipmentCode);
      // Trigger a refresh of the dock door data
      // You would typically use React Query to handle this
    } catch (error) {
      console.error("Error docking in vehicle:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDockOut = async () => {
    if (!assignedTruck) {
      toast.error("No vehicle assigned to this dock");
      return;
    }

    try {
      setIsLoading(true);
      await dockOutVehicle(dockId, assignedTruck);
      // Trigger a refresh of the dock door data
    } catch (error) {
      console.error("Error docking out vehicle:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border-t bg-muted/50">
      {status === "Occupied" && estimatedCompletion && (
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Est. completion: {new Date(estimatedCompletion).toLocaleTimeString()}</span>
        </div>
      )}
      
      <div className="flex justify-between gap-2">
        {status === "Available" ? (
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleDockIn}
            disabled={isLoading}
          >
            Dock In
          </Button>
        ) : status === "Occupied" ? (
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={handleDockOut}
            disabled={isLoading}
          >
            Dock Out
          </Button>
        ) : (
          <Button className="w-full" variant="outline" disabled>
            Under Maintenance
          </Button>
        )}
        
        {/* Add Block Dock button - this functionality already exists */}
        <Button className="w-full" variant="secondary">
          Block Dock
        </Button>
      </div>
    </div>
  );
}
