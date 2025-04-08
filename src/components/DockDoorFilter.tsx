
import { DockStatus } from "@/lib/data";
import { Button } from "@/components/ui/button";

interface DockDoorFilterProps {
  selectedStatus: DockStatus | "All";
  onStatusChange: (status: DockStatus | "All") => void;
}

export function DockDoorFilter({ selectedStatus, onStatusChange }: DockDoorFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedStatus === "All" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("All")}
        className={selectedStatus === "All" ? "bg-dock-primary hover:bg-dock-primary/90" : ""}
      >
        All
      </Button>
      <Button
        variant={selectedStatus === "Available" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("Available")}
        className={selectedStatus === "Available" ? "bg-green-600 hover:bg-green-700" : ""}
      >
        Available
      </Button>
      <Button
        variant={selectedStatus === "Occupied" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("Occupied")}
        className={selectedStatus === "Occupied" ? "bg-amber-500 hover:bg-amber-600" : ""}
      >
        Occupied
      </Button>
      <Button
        variant={selectedStatus === "Maintenance" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("Maintenance")}
        className={selectedStatus === "Maintenance" ? "bg-gray-500 hover:bg-gray-600" : ""}
      >
        Maintenance
      </Button>
    </div>
  );
}
