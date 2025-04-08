
import { useState } from "react";
import { DockStatus } from "@/lib/data";
import { DockDoorCard } from "@/components/DockDoorCard";
import { TruckQueue } from "@/components/TruckQueue";
import { VolumeChart } from "@/components/DashboardCharts";
import { CargoTypeChart } from "@/components/CargoTypeChart";
import { DockStatusSummary } from "@/components/DockStatusSummary";
import { Header } from "@/components/Header";
import { DockDoorFilter } from "@/components/DockDoorFilter";
import { Warehouse, RefreshCw } from "lucide-react";
import { AverageDockTime } from "@/components/AverageDockTime";
import { AddVehicleForm } from "@/components/AddVehicleForm";
import { useQuery } from "@tanstack/react-query";
import { fetchDockDoors } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [statusFilter, setStatusFilter] = useState<DockStatus | "All">("All");
  const { toast } = useToast();
  
  const { 
    data: dockDoors = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['dockDoors'],
    queryFn: fetchDockDoors
  });

  const filteredDocks = statusFilter === "All" 
    ? dockDoors 
    : dockDoors.filter(dock => dock.status === statusFilter);

  const refreshData = async () => {
    toast({
      title: "Refreshing data...",
      description: "Fetching the latest information from the server."
    });
    
    try {
      await refetch();
      toast({
        title: "Data refreshed",
        description: "The dashboard has been updated with the latest information."
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "There was an issue refreshing the data. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Use data from lib/data.ts for hourly volume chart
  const hourlyVolume = [
    { hour: "6AM", trucks: 3 },
    { hour: "7AM", trucks: 5 },
    { hour: "8AM", trucks: 8 },
    { hour: "9AM", trucks: 12 },
    { hour: "10AM", trucks: 10 },
    { hour: "11AM", trucks: 7 },
    { hour: "12PM", trucks: 6 },
    { hour: "1PM", trucks: 9 },
    { hour: "2PM", trucks: 11 },
    { hour: "3PM", trucks: 8 },
    { hour: "4PM", trucks: 6 },
    { hour: "5PM", trucks: 4 }
  ];

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
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={refreshData}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
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
            {isLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Loading dock doors...</span>
                </div>
              </div>
            ) : isError ? (
              <div className="col-span-full text-center py-8 text-red-500">
                Error loading dock doors. Please try refreshing.
              </div>
            ) : filteredDocks.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No dock doors found with the selected filter.
              </div>
            ) : (
              filteredDocks.map((dock) => (
                <DockDoorCard key={dock.id} dock={dock} />
              ))
            )}
          </div>
        </div>
        
        {/* Truck Queue */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-xl font-semibold">Truck Queue</h2>
            <AddVehicleForm />
          </div>
          <TruckQueue />
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <CargoTypeChart />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <VolumeChart data={hourlyVolume} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
