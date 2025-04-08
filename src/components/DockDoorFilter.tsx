
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
        variant={selectedStatus === "AVAILABLE" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("AVAILABLE")}
        className={selectedStatus === "AVAILABLE" ? "bg-green-600 hover:bg-green-700" : ""}
      >
        Available
      </Button>
      <Button
        variant={selectedStatus === "OCCUPIED" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("OCCUPIED")}
        className={selectedStatus === "OCCUPIED" ? "bg-amber-500 hover:bg-amber-600" : ""}
      >
        Occupied
      </Button>
      <Button
        variant={selectedStatus === "UNDER_MAINTENANCE" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("UNDER_MAINTENANCE")}
        className={selectedStatus === "UNDER_MAINTENANCE" ? "bg-gray-500 hover:bg-gray-600" : ""}
      >
        Maintenance
      </Button>
    </div>
  );
}
