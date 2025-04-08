
import { DockDoor } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DockDoorCardProps {
  dock: DockDoor;
}

export function DockDoorCard({ dock }: DockDoorCardProps) {
  // Determine status class for styling
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 border-green-500 text-green-800";
      case "Occupied":
        return "bg-amber-100 border-amber-500 text-amber-800";
      case "Maintenance":
        return "bg-gray-100 border-gray-500 text-gray-800";
      default:
        return "bg-blue-100 border-blue-500 text-blue-800";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return "status-badge status-available";
      case "Occupied":
        return "status-badge status-occupied";
      case "Maintenance":
        return "status-badge status-maintenance";
      default:
        return "status-badge";
    }
  };

  // Format last updated time as "X minutes/hours ago"
  const formattedTime = formatDistanceToNow(new Date(dock.lastUpdated), { addSuffix: true });

  return (
    <Card className={`border-l-4 ${getStatusClass(dock.status)} h-full`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">{dock.name}</CardTitle>
          <span className={getStatusBadge(dock.status)}>{dock.status}</span>
        </div>
      </CardHeader>
      <CardContent>
        {dock.status === "Occupied" && (
          <div className="mt-1">
            <p className="text-sm font-medium">Truck: {dock.assignedTruck}</p>
            {dock.estimatedCompletion && (
              <p className="text-xs text-muted-foreground mt-1">
                Est. completion: {new Date(dock.estimatedCompletion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        )}
        
        {dock.status === "Maintenance" && dock.estimatedCompletion && (
          <p className="text-xs text-muted-foreground mt-1">
            Est. completion: {new Date(dock.estimatedCompletion).toLocaleDateString()} at {new Date(dock.estimatedCompletion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}

        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Updated {formattedTime}</span>
        </div>
      </CardContent>
    </Card>
  );
}
