
import { DockDoor } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DockStatusSummaryProps {
  dockDoors: DockDoor[];
}

export function DockStatusSummary({ dockDoors }: DockStatusSummaryProps) {
  const availableCount = dockDoors.filter(dock => dock.status === "Available").length;
  const occupiedCount = dockDoors.filter(dock => dock.status === "Occupied").length;
  const maintenanceCount = dockDoors.filter(dock => dock.status === "Maintenance").length;
  const totalCount = dockDoors.length;
  
  const availablePercentage = Math.round((availableCount / totalCount) * 100);
  const occupiedPercentage = Math.round((occupiedCount / totalCount) * 100);
  const maintenancePercentage = Math.round((maintenanceCount / totalCount) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Available Docks</p>
              <h2 className="text-3xl font-bold">{availableCount}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-800 font-bold">{availablePercentage}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Occupied Docks</p>
              <h2 className="text-3xl font-bold">{occupiedCount}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-800 font-bold">{occupiedPercentage}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
              <h2 className="text-3xl font-bold">{maintenanceCount}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-800 font-bold">{maintenancePercentage}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
