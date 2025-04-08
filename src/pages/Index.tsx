
import { useState } from "react";
import { DockDoor, DockStatus, activityData, dockDoors, hourlyVolumeData, trucks } from "@/lib/data";
import { DockDoorCard } from "@/components/DockDoorCard";
import { TruckQueue } from "@/components/TruckQueue";
import { ActivityChart, VolumeChart } from "@/components/DashboardCharts";
import { DockStatusSummary } from "@/components/DockStatusSummary";
import { Header } from "@/components/Header";
import { DockDoorFilter } from "@/components/DockDoorFilter";
import { Warehouse } from "lucide-react";
import { AverageDockTime } from "@/components/AverageDockTime";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="p-2 rounded-full bg-dock-primary/10">
              <Warehouse className="h-5 w-5 text-dock-primary" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-dock-primary to-dock-secondary bg-clip-text text-transparent">
              Inbound Dock Dashboard
            </h1>
          </div>
        </div>

        {/* Average Dock Time & Status Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <AverageDockTime />
          <div className="lg:col-span-3">
            <DockStatusSummary dockDoors={dockDoors} />
          </div>
        </div>
        
        {/* Dock Doors Section */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0">Dock Doors</h2>
            <DockDoorFilter selectedStatus={statusFilter} onStatusChange={setStatusFilter} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {filteredDocks.map((dock) => (
              <DockDoorCard key={dock.id} dock={dock} />
            ))}
          </div>
        </div>
        
        {/* Truck Queue */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Truck Queue</h2>
          <TruckQueue trucks={trucks} />
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <ActivityChart data={activityData} />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <VolumeChart data={hourlyVolumeData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
