
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useState } from "react";
import { dockInVehicle, dockOutVehicle } from "@/lib/supabase/dockOperations";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface DockCardFooterProps {
  dockId: string;
  status: string;
  assignedTruck?: string;
  estimatedCompletion?: string;
}

export function DockCardFooter({ dockId, status, assignedTruck, estimatedCompletion }: DockCardFooterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDockIn = async () => {
    try {
      setIsLoading(true);
      // The updated dockInVehicle function will find the next available vehicle
      await dockInVehicle(dockId);
      // Refresh data through React Query
      queryClient.invalidateQueries({ queryKey: ['dockDoors'] });
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
    } catch (error) {
      console.error("Error docking in vehicle:", error);
      // Error toast is already handled in the dockInVehicle function
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
      // Refresh data through React Query
      queryClient.invalidateQueries({ queryKey: ['dockDoors'] });
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
    } catch (error) {
      console.error("Error docking out vehicle:", error);
      // Error toast is already handled in the dockOutVehicle function
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
          disabled={isLoading || status.toUpperCase() !== "AVAILABLE"}
        >
          Dock In
        </Button>
        
        <Button 
          className="flex-1" 
          onClick={handleDockOut}
          disabled={isLoading || status.toUpperCase() !== "OCCUPIED"}
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
