
import { DockDoor } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, TruckIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Progress } from "@/components/ui/progress"; 

interface DockDoorCardProps {
  dock: DockDoor;
}

export function DockDoorCard({ dock }: DockDoorCardProps) {
  // Determine cargo type and set badge colors
  const getCargoType = () => {
    // In a real app, this would come from the server data
    const types = ["Frozen", "Normal", "Mixed"];
    return types[Math.floor(dock.id % 3)]; // For demo purposes
  };

  const getLoadingPercentage = () => {
    // In a real app, this would come from the server data
    return dock.status === "Occupied" ? Math.floor((Date.now() - new Date(dock.lastUpdated).getTime()) / 1000) % 100 : 0;
  };

  // Determine status class for styling
  const getStatusClass = (status: string) => {
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

  // Format last updated time as "X minutes/hours ago"
  const formattedTime = formatDistanceToNow(new Date(dock.lastUpdated), { addSuffix: true });
  const cargoType = getCargoType();
  const loadingPercentage = getLoadingPercentage();

  return (
    <Card className={`${getStatusClass(dock.status)} shadow-sm hover:shadow-md transition-all`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">{dock.name}</CardTitle>
          <span className={getStatusBadge(dock.status)}>{dock.status}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-1">
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
                Est. completion: {new Date(dock.estimatedCompletion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        )}
        
        {dock.status === "Maintenance" && dock.estimatedCompletion && (
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Est. completion: {new Date(dock.estimatedCompletion).toLocaleDateString()} at {new Date(dock.estimatedCompletion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col pt-0 space-y-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground w-full">
          <Clock className="h-3 w-3" />
          <span>Updated {formattedTime}</span>
        </div>
        
        <div className="flex gap-2 w-full">
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1 text-xs font-medium"
            disabled={dock.status === "Maintenance"}
          >
            Dock In
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs font-medium"
            disabled={dock.status !== "Occupied"}
          >
            Dock Out
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
