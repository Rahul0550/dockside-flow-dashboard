
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

interface TruckQueueProps {
  trucks: Truck[];
}

export function TruckQueue({ trucks }: TruckQueueProps) {
  // Sort trucks by priority and arrival time
  const sortedTrucks = [...trucks].sort((a, b) => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High</Badge>;
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "Low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Truck Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Truck ID</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dock</TableHead>
                <TableHead className="text-right">Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTrucks.map((truck) => (
                <TableRow key={truck.id}>
                  <TableCell className="font-medium">{truck.id}</TableCell>
                  <TableCell>{truck.carrier}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(truck.arrivalTime), { addSuffix: true })}</TableCell>
                  <TableCell>{getStatusBadge(truck.status)}</TableCell>
                  <TableCell>{truck.assignedDock || "—"}</TableCell>
                  <TableCell className="text-right">{getPriorityBadge(truck.priority)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
