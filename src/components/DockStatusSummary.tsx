
import { DockDoor } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="grid grid-cols-3 gap-4 h-full">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
        <CardContent className="pt-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-green-800/70">Available Docks</p>
            <h2 className="text-3xl font-bold text-green-700">{availableCount}</h2>
          </div>
          <div className="h-14 w-14 rounded-full bg-green-100/80 flex items-center justify-center border border-green-200">
            <span className="text-green-800 font-bold">{availablePercentage}%</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100">
        <CardContent className="pt-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-amber-800/70">Occupied Docks</p>
            <h2 className="text-3xl font-bold text-amber-700">{occupiedCount}</h2>
          </div>
          <div className="h-14 w-14 rounded-full bg-amber-100/80 flex items-center justify-center border border-amber-200">
            <span className="text-amber-800 font-bold">{occupiedPercentage}%</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100">
        <CardContent className="pt-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-800/70">Maintenance</p>
            <h2 className="text-3xl font-bold text-gray-700">{maintenanceCount}</h2>
          </div>
          <div className="h-14 w-14 rounded-full bg-gray-100/80 flex items-center justify-center border border-gray-200">
            <span className="text-gray-800 font-bold">{maintenancePercentage}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
