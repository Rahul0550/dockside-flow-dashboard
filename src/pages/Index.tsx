
import { useState } from "react";
import { DockDoor, DockStatus, activityData, dockDoors, hourlyVolumeData, trucks } from "@/lib/data";
import { DockDoorCard } from "@/components/DockDoorCard";
import { TruckQueue } from "@/components/TruckQueue";
import { ActivityChart, VolumeChart } from "@/components/DashboardCharts";
import { DockStatusSummary } from "@/components/DockStatusSummary";
import { Header } from "@/components/Header";
import { DockDoorFilter } from "@/components/DockDoorFilter";
import { Warehouse } from "lucide-react";

const Index = () => {
  const [statusFilter, setStatusFilter] = useState<DockStatus | "All">("All");

  const filteredDocks = statusFilter === "All" 
    ? dockDoors 
    : dockDoors.filter(dock => dock.status === statusFilter);

  const refreshData = () => {
    console.log("Refreshing data...");
    // In a real application, this would fetch new data from the server
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <Warehouse className="h-6 w-6 mr-2 text-dock-primary" />
            <h1 className="text-2xl font-bold text-dock-primary">Inbound Dock Dashboard</h1>
          </div>
        </div>

        {/* Status Summary */}
        <div className="mb-8">
          <DockStatusSummary dockDoors={dockDoors} />
        </div>
        
        {/* Dock Doors Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0">Dock Doors</h2>
            <DockDoorFilter selectedStatus={statusFilter} onStatusChange={setStatusFilter} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDocks.map((dock) => (
              <DockDoorCard key={dock.id} dock={dock} />
            ))}
          </div>
        </div>
        
        {/* Truck Queue */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Truck Queue</h2>
          <TruckQueue trucks={trucks} />
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityChart data={activityData} />
          <VolumeChart data={hourlyVolumeData} />
        </div>
      </main>
    </div>
  );
};

export default Index;
