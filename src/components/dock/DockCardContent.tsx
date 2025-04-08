
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DockDoor } from "@/lib/data";
import { TruckIcon } from "lucide-react";

interface DockCardContentProps {
  dock: DockDoor;
  isBlocked: boolean;
}

export function DockCardContent({ dock, isBlocked }: DockCardContentProps) {
  const getCargoType = () => {
    const types = ["Frozen", "Normal", "Mixed"];
    return types[Math.floor(Number(dock.id.replace("D", "")) % 3)];
  };

  const getLoadingPercentage = () => {
    return dock.status === "Occupied"
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

  const cargoType = getCargoType();
  const loadingPercentage = getLoadingPercentage();

  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <Badge className={getCargoBadgeColor(cargoType)}>{cargoType}</Badge>
        {dock.status === "Occupied" && (
          <Badge variant="outline" className="flex items-center gap-1">
            <TruckIcon className="h-3 w-3" />
            <span>{dock.assignedTruck}</span>
          </Badge>
        )}
      </div>

      {dock.status === "Occupied" && (
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">Loading Progress</span>
            <span className="font-medium">{loadingPercentage}%</span>
          </div>
          <Progress value={loadingPercentage} className="h-2" />

          {dock.estimatedCompletion && (
            <p className="text-xs text-muted-foreground mt-1">
              Est. completion:{" "}
              {new Date(dock.estimatedCompletion).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      )}

      {dock.status === "Maintenance" && dock.estimatedCompletion && (
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          Est. completion:{" "}
          {new Date(dock.estimatedCompletion).toLocaleDateString()} at{" "}
          {new Date(dock.estimatedCompletion).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </>
  );
}
