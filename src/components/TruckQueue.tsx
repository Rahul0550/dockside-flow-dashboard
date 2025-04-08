
import { useState } from "react";
import { Truck } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Filter, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TruckQueueProps {
  trucks: Truck[];
}

type SortDirection = "asc" | "desc" | null;
type SortKey = keyof Truck | "";

interface FilterState {
  carrier: string[];
  status: string[];
  cargoType: string[];
}

export function TruckQueue({ trucks }: TruckQueueProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filters, setFilters] = useState<FilterState>({
    carrier: [],
    status: [],
    cargoType: [],
  });

  // Filter and sort trucks
  const filteredTrucks = trucks.filter((truck) => {
    const searchMatch =
      searchTerm === "" ||
      truck.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.driver.toLowerCase().includes(searchTerm.toLowerCase());

    const carrierMatch = 
      filters.carrier.length === 0 || 
      filters.carrier.includes(truck.carrier);
    
    const statusMatch = 
      filters.status.length === 0 || 
      filters.status.includes(truck.status);
    
    const cargoTypeMatch = 
      filters.cargoType.length === 0 || 
      (truck.cargoType && filters.cargoType.includes(truck.cargoType));

    return searchMatch && carrierMatch && statusMatch && cargoTypeMatch;
  });

  const sortedTrucks = [...filteredTrucks].sort((a, b) => {
    if (!sortKey || sortDirection === null) return 0;
    
    const aValue = a[sortKey as keyof Truck];
    const bValue = b[sortKey as keyof Truck];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    } else if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc' 
        ? aValue.getTime() - bValue.getTime() 
        : bValue.getTime() - aValue.getTime();
    }

    // For string dates
    if (sortKey === 'arrivalTime' || sortKey === 'appointmentTime' || sortKey === 'estimatedDockOutTime') {
      const aDate = new Date(aValue as string);
      const bDate = new Date(bValue as string);
      return sortDirection === 'asc' 
        ? aDate.getTime() - bDate.getTime() 
        : bDate.getTime() - aDate.getTime();
    }

    return 0;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortKey("");
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const toggleFilter = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentFilters = [...prev[filterType]];
      const index = currentFilters.indexOf(value);
      
      if (index === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(index, 1);
      }
      
      return {
        ...prev,
        [filterType]: currentFilters
      };
    });
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

  const getCargoTypeBadge = (cargoType?: string) => {
    switch (cargoType) {
      case "Frozen":
        return <Badge className="bg-cyan-600">Frozen</Badge>;
      case "Normal":
        return <Badge className="bg-emerald-600">Normal</Badge>;
      case "Both":
      case "Mixed":
        return <Badge className="bg-purple-600">Mixed</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  // Get unique values for filters
  const uniqueCarriers = Array.from(new Set(trucks.map(t => t.carrier)));
  const uniqueStatuses = Array.from(new Set(trucks.map(t => t.status)));
  const uniqueCargoTypes = Array.from(new Set(trucks.filter(t => t.cargoType).map(t => t.cargoType as string)));

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return null;
    if (sortDirection === 'asc') return <ChevronUp className="inline h-4 w-4 ml-1" />;
    if (sortDirection === 'desc') return <ChevronDown className="inline h-4 w-4 ml-1" />;
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Truck Queue</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[250px] pl-8"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px] cursor-pointer" onClick={() => handleSort("licensePlate")}>
                  Vehicle No. {getSortIcon("licensePlate")}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                        <Filter className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-2" align="start">
                      <div className="grid gap-2">
                        <div className="text-xs font-medium">Filter</div>
                        <Input
                          placeholder="Search..."
                          className="h-8"
                          onChange={(e) => setSearchTerm(e.target.value)}
                          value={searchTerm}
                        />
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("carrier")}>
                  Carrier {getSortIcon("carrier")}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                        <Filter className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-2" align="start">
                      <div className="grid gap-2">
                        <div className="text-xs font-medium">Filter by Carrier</div>
                        {uniqueCarriers.map(carrier => (
                          <div key={carrier} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`carrier-${carrier}`} 
                              checked={filters.carrier.includes(carrier)}
                              onCheckedChange={() => toggleFilter('carrier', carrier)}
                            />
                            <Label htmlFor={`carrier-${carrier}`} className="text-xs">{carrier}</Label>
                          </div>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("appointmentTime")}>
                  Appointment {getSortIcon("appointmentTime")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("arrivalTime")}>
                  Est. Arrival {getSortIcon("arrivalTime")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("actualArrivalTime")}>
                  Actual Arrival {getSortIcon("actualArrivalTime")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("estimatedDockOutTime")}>
                  Est. Dock Out {getSortIcon("estimatedDockOutTime")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  Status {getSortIcon("status")}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                        <Filter className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-2" align="start">
                      <div className="grid gap-2">
                        <div className="text-xs font-medium">Filter by Status</div>
                        {uniqueStatuses.map(status => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`status-${status}`} 
                              checked={filters.status.includes(status)}
                              onCheckedChange={() => toggleFilter('status', status)}
                            />
                            <Label htmlFor={`status-${status}`} className="text-xs">{status}</Label>
                          </div>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("assignedDock")}>
                  Dock {getSortIcon("assignedDock")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("cargoType")}>
                  Cargo Type {getSortIcon("cargoType")}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                        <Filter className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-2" align="start">
                      <div className="grid gap-2">
                        <div className="text-xs font-medium">Filter by Cargo</div>
                        {uniqueCargoTypes.map(type => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`cargo-${type}`} 
                              checked={filters.cargoType.includes(type)}
                              onCheckedChange={() => toggleFilter('cargoType', type)}
                            />
                            <Label htmlFor={`cargo-${type}`} className="text-xs">{type}</Label>
                          </div>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTrucks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    No vehicles found matching the criteria
                  </TableCell>
                </TableRow>
              ) : (
                sortedTrucks.map((truck) => (
                  <TableRow key={truck.id}>
                    <TableCell className="font-medium">{truck.licensePlate}</TableCell>
                    <TableCell>{truck.carrier}</TableCell>
                    <TableCell>{truck.appointmentTime ? new Date(truck.appointmentTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : "—"}</TableCell>
                    <TableCell>{new Date(truck.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</TableCell>
                    <TableCell>{truck.actualArrivalTime ? new Date(truck.actualArrivalTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : "—"}</TableCell>
                    <TableCell>{truck.estimatedDockOutTime ? new Date(truck.estimatedDockOutTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : "—"}</TableCell>
                    <TableCell>{getStatusBadge(truck.status)}</TableCell>
                    <TableCell>{truck.assignedDock || "—"}</TableCell>
                    <TableCell>{truck.cargoType ? getCargoTypeBadge(truck.cargoType) : "—"}</TableCell>
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
