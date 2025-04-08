
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DockDoor } from "@/lib/data";
import { TruckIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface DockCardContentProps {
  dock: DockDoor;
  isBlocked: boolean;
}

export function DockCardContent({ dock, isBlocked }: DockCardContentProps) {
  const getCargoType = () => {
    const types = ["Frozen", "Normal", "Mixed"];
    return types[Math.floor(Number(dock.id.replace("D", "")) % 3)];
  };

  const getLoadingPercentage = () => {
    return dock.status === "OCCUPIED"
      ? Math.floor((Date.now() - new Date(dock.lastUpdated).getTime()) / 1000) %
          100
      : 0;
  };

  const getCargoBadgeColor = (type: string) => {
    switch (type) {
      case "Frozen":
        return "bg-blue-100 text-blue-800";
      case "Normal":
        return "bg-green-100 text-green-800";
      case "Mixed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVehicleTypeBadgeColor = (type: string) => {
    switch (type) {
      case "truck":
        return "bg-amber-100 text-amber-800";
      case "van":
        return "bg-pink-100 text-pink-800";
      case "container":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatLastUpdated = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return "Unknown";
    }
  };

  const cargoType = getCargoType();
  const loadingPercentage = getLoadingPercentage();

  return (
    <>
      <div className="mb-3 flex flex-wrap gap-2">
        {dock.product_type && (
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <span>Product: {dock.product_type}</span>
          </Badge>
        )}
        
        {dock.vehicle_type_compatibility && dock.vehicle_type_compatibility.length > 0 && (
          <Badge 
            className={`text-xs ${getVehicleTypeBadgeColor(dock.vehicle_type_compatibility[0])}`}
          >
            {dock.vehicle_type_compatibility[0]}
          </Badge>
        )}

        {dock.status === "OCCUPIED" && dock.assignedTruck && (
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <TruckIcon className="h-3 w-3" />
            <span>{dock.assignedTruck}</span>
          </Badge>
        )}
      </div>

      {dock.status === "OCCUPIED" && (
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">Loading Progress</span>
            <span className="font-medium">{loadingPercentage}%</span>
          </div>
          <Progress value={loadingPercentage} className="h-2" />

          {dock.estimatedCompletion && (
            <p className="text-xs text-muted-foreground mt-2">
              Est. completion:{" "}
              {new Date(dock.estimatedCompletion).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      )}

      {dock.status === "UNDER_MAINTENANCE" && dock.estimatedCompletion && (
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          Est. completion:{" "}
          {new Date(dock.estimatedCompletion).toLocaleDateString()} at{" "}
          {new Date(dock.estimatedCompletion).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}

      <div className="text-xs text-muted-foreground">
        Last updated: {formatLastUpdated(dock.lastUpdated)}
      </div>
    </>
  );
}
