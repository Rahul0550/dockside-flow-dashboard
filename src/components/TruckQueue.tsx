
import { useState } from "react";
import { Truck } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrucks } from "@/lib/supabase";

interface TruckQueueProps {
  trucks?: Truck[];
}

type SortField = 
  | "vehicleNumber" 
  | "shipmentCode"
  | "appointmentTime" 
  | "estimatedArrivalTime" 
  | "estimatedDockOutTime" 
  | "actualArrivalTime" 
  | "cargoType"
  | "status";

// Updated type mapping for Supabase to our local interfaces
type SupabaseTruckToTruck = (truck: any) => Truck;

const mapSupabaseTruckToTruck: SupabaseTruckToTruck = (truck) => ({
  id: truck.shipment_code || "",
  vehicleNumber: truck.vehicle_number || "",
  vehicle_number: truck.vehicle_number || "",
  licensePlate: truck.vehicle_number || "", // Fallback to vehicle_number
  shipmentCode: truck.shipment_code || "",
  shipment_code: truck.shipment_code || "",
  carrier: truck.transporter || "",
  driver: truck.driver_name || "",
  driver_name: truck.driver_name || "",
  driverContact: truck.driver_contact || undefined,
  driver_contact: truck.driver_contact || undefined,
  transporter: truck.transporter || undefined,
  cargoType: truck.cargo_types && truck.cargo_types.length > 0 ? truck.cargo_types[0] : "Normal",
  cargo_types: truck.cargo_types || ["Normal"],
  quantity: truck.quantity || 0,
  arrivalTime: truck.eta || "",
  actualArrivalTime: truck.dock_in_time || undefined,
  dock_in_time: truck.dock_in_time || undefined,
  appointmentTime: truck.appointment_time || undefined,
  appointment_time: truck.appointment_time || undefined,
  estimatedArrivalTime: truck.eta || "",
  eta: truck.eta || "",
  estimatedDockOutTime: truck.dock_out_time || undefined,
  dock_out_time: truck.dock_out_time || undefined,
  status: truck.dockdoor_assigned ? "Assigned" : "In Queue",
  assignedDock: truck.dockdoor_assigned || undefined,
  dockdoor_assigned: truck.dockdoor_assigned || undefined,
  estimatedWaitTime: undefined,
  priority: "Medium" // Default priority
});

export function TruckQueue({ trucks: initialTrucks }: TruckQueueProps) {
  const [sortField, setSortField] = useState<SortField>("estimatedArrivalTime");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch trucks from Supabase with staleTime set to 0 to ensure fresh data on refetch
  const { data: fetchedTrucks = [], isLoading, isError } = useQuery({
    queryKey: ['truckQueue'],
    queryFn: fetchTrucks,
    enabled: !initialTrucks,
    staleTime: 0,
    refetchOnWindowFocus: true
  });
  
  // Map Supabase data to our application's Truck type
  const trucks = initialTrucks || fetchedTrucks.map(mapSupabaseTruckToTruck);
  
  // Handle sorting
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="pt-6 flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  if (isError || !trucks) {
    return (
      <Card className="h-full">
        <CardContent className="pt-6 flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">Error loading truck data</p>
        </CardContent>
      </Card>
    );
  }
  
  // Filter and sort trucks
  const filteredAndSortedTrucks = [...trucks]
    .filter(truck => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        truck.vehicleNumber.toLowerCase().includes(query) ||
        truck.shipmentCode.toLowerCase().includes(query) ||
        truck.driver.toLowerCase().includes(query) ||
        truck.carrier.toLowerCase().includes(query) ||
        truck.cargoType.toLowerCase().includes(query) ||
        (truck.transporter && truck.transporter.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      let valA: any;
      let valB: any;
      
      // Special handling for date fields
      if (["appointmentTime", "estimatedArrivalTime", "estimatedDockOutTime", "actualArrivalTime"].includes(sortField)) {
        valA = a[sortField as keyof Truck] ? new Date(a[sortField as keyof Truck] as string).getTime() : 0;
        valB = b[sortField as keyof Truck] ? new Date(b[sortField as keyof Truck] as string).getTime() : 0;
      } else {
        valA = a[sortField as keyof Truck] || "";
        valB = b[sortField as keyof Truck] || "";
      }
      
      if (valA === valB) return 0;
      
      const comparison = valA < valB ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Assigned":
        return <Badge className="bg-blue-500">Assigned</Badge>;
      case "In Queue":
        return <Badge className="bg-amber-500">In Queue</Badge>;
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "MMM d, h:mm a");
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="mb-4 relative">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles, shipments, drivers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("vehicleNumber")}
                >
                  Vehicle No. {getSortIcon("vehicleNumber")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("shipmentCode")}
                >
                  Shipment {getSortIcon("shipmentCode")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("appointmentTime")}
                >
                  Appointment {getSortIcon("appointmentTime")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("estimatedArrivalTime")}
                >
                  Est. Arrival {getSortIcon("estimatedArrivalTime")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("actualArrivalTime")}
                >
                  Actual Arrival {getSortIcon("actualArrivalTime")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("estimatedDockOutTime")}
                >
                  Est. Dock Out {getSortIcon("estimatedDockOutTime")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("cargoType")}
                >
                  Cargo Type {getSortIcon("cargoType")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("status")}
                >
                  Status {getSortIcon("status")}
                </TableHead>
                <TableHead>Dock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTrucks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                    No vehicles found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedTrucks.map((truck) => (
                  <TableRow key={truck.id}>
                    <TableCell className="font-medium">{truck.vehicleNumber}</TableCell>
                    <TableCell>{truck.shipmentCode}</TableCell>
                    <TableCell>{formatDateTime(truck.appointmentTime)}</TableCell>
                    <TableCell>{formatDateTime(truck.estimatedArrivalTime)}</TableCell>
                    <TableCell>{formatDateTime(truck.actualArrivalTime)}</TableCell>
                    <TableCell>{formatDateTime(truck.estimatedDockOutTime)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        truck.cargoType === "Frozen" ? "bg-blue-100 text-blue-800 border-blue-300" :
                        truck.cargoType === "Normal" ? "bg-green-100 text-green-800 border-green-300" :
                        "bg-purple-100 text-purple-800 border-purple-300"
                      }>
                        {truck.cargoType}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(truck.status)}</TableCell>
                    <TableCell>{truck.assignedDock || "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
