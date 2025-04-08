
export type DockStatus = "Available" | "Occupied" | "Maintenance";

export interface DockDoor {
  id: string;
  name: string;
  status: DockStatus;
  assignedTruck?: string;
  lastUpdated: string;
  estimatedCompletion?: string;
}

export interface Truck {
  id: string;
  licensePlate: string;
  carrier: string;
  driver: string;
  arrivalTime: string;
  status: "In Queue" | "Assigned" | "Completed";
  assignedDock?: string;
  estimatedWaitTime?: string;
  priority: "Low" | "Medium" | "High";
}

export interface ActivityData {
  day: string;
  arrivals: number;
  departures: number;
}

// Mock data for dock doors
export const dockDoors: DockDoor[] = [
  { 
    id: "D1", 
    name: "Dock D1", 
    status: "Available", 
    lastUpdated: "2025-04-08T08:30:00" 
  },
  { 
    id: "D2", 
    name: "Dock D2", 
    status: "Occupied", 
    assignedTruck: "T123", 
    lastUpdated: "2025-04-08T09:15:00",
    estimatedCompletion: "2025-04-08T10:45:00"
  },
  { 
    id: "D3", 
    name: "Dock D3", 
    status: "Maintenance", 
    lastUpdated: "2025-04-08T07:45:00",
    estimatedCompletion: "2025-04-09T12:00:00"
  },
  { 
    id: "D4", 
    name: "Dock D4", 
    status: "Available", 
    lastUpdated: "2025-04-08T08:00:00" 
  },
  { 
    id: "D5", 
    name: "Dock D5", 
    status: "Occupied",
    assignedTruck: "T456", 
    lastUpdated: "2025-04-08T08:45:00",
    estimatedCompletion: "2025-04-08T11:30:00" 
  },
  { 
    id: "D6", 
    name: "Dock D6", 
    status: "Available", 
    lastUpdated: "2025-04-08T08:15:00" 
  },
  { 
    id: "D7", 
    name: "Dock D7", 
    status: "Occupied",
    assignedTruck: "T789", 
    lastUpdated: "2025-04-08T09:30:00",
    estimatedCompletion: "2025-04-08T12:15:00" 
  },
  { 
    id: "D8", 
    name: "Dock D8", 
    status: "Maintenance", 
    lastUpdated: "2025-04-07T16:30:00",
    estimatedCompletion: "2025-04-10T09:00:00" 
  },
];

// Mock data for trucks
export const trucks: Truck[] = [
  {
    id: "T123",
    licensePlate: "ABC-1234",
    carrier: "FastFreight Inc.",
    driver: "John Smith",
    arrivalTime: "2025-04-08T08:30:00",
    status: "Assigned",
    assignedDock: "D2",
    priority: "Medium"
  },
  {
    id: "T456",
    licensePlate: "XYZ-7890",
    carrier: "Swift Logistics",
    driver: "Maria Garcia",
    arrivalTime: "2025-04-08T08:45:00",
    status: "Assigned",
    assignedDock: "D5",
    priority: "High"
  },
  {
    id: "T789",
    licensePlate: "DEF-4567",
    carrier: "Global Transport",
    driver: "Robert Johnson",
    arrivalTime: "2025-04-08T09:00:00",
    status: "Assigned",
    assignedDock: "D7",
    priority: "Medium"
  },
  {
    id: "T234",
    licensePlate: "GHI-8901",
    carrier: "Quick Shipping Co.",
    driver: "David Lee",
    arrivalTime: "2025-04-08T09:15:00",
    status: "In Queue",
    estimatedWaitTime: "45 minutes",
    priority: "Low"
  },
  {
    id: "T567",
    licensePlate: "JKL-2345",
    carrier: "Express Freight",
    driver: "Susan Williams",
    arrivalTime: "2025-04-08T09:30:00",
    status: "In Queue",
    estimatedWaitTime: "1 hour",
    priority: "High"
  },
  {
    id: "T890",
    licensePlate: "MNO-6789",
    carrier: "Reliable Transport",
    driver: "James Brown",
    arrivalTime: "2025-04-08T08:15:00",
    status: "Completed",
    priority: "Medium"
  }
];

// Mock data for activity chart
export const activityData: ActivityData[] = [
  { day: "Mon", arrivals: 24, departures: 22 },
  { day: "Tue", arrivals: 18, departures: 20 },
  { day: "Wed", arrivals: 30, departures: 28 },
  { day: "Thu", arrivals: 27, departures: 25 },
  { day: "Fri", arrivals: 32, departures: 30 },
  { day: "Sat", arrivals: 15, departures: 17 },
  { day: "Sun", arrivals: 8, departures: 10 }
];

// Mock data for hourly volume chart
export const hourlyVolumeData = [
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
