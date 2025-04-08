
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
      toast.success(`Vehicle docked in successfully`);
      // Trigger a refresh of the dock door data
      // You would typically use React Query to handle this
    } catch (error) {
      console.error("Error docking in vehicle:", error);
      toast.error("Failed to dock in vehicle");
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
      toast.success(`Vehicle docked out successfully`);
      // Trigger a refresh of the dock door data
    } catch (error) {
      console.error("Error docking out vehicle:", error);
      toast.error("Failed to dock out vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border-t bg-muted/50">
      {status === "OCCUPIED" && estimatedCompletion && (
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Est. completion: {new Date(estimatedCompletion).toLocaleTimeString()}</span>
        </div>
      )}
      
      <div className="flex gap-2">
        <Button 
          className="flex-1" 
          onClick={handleDockIn}
          disabled={isLoading || status !== "AVAILABLE"}
        >
          Dock In
        </Button>
        
        <Button 
          className="flex-1" 
          onClick={handleDockOut}
          disabled={isLoading || status !== "OCCUPIED" || !assignedTruck}
        >
          Dock Out
        </Button>
        
        {status === "UNDER_MAINTENANCE" && (
          <div className="w-full text-center text-sm text-muted-foreground">
            This dock is under maintenance
          </div>
        )}
      </div>
    </div>
  );
}
