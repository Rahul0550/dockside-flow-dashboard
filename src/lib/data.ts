
export type DockStatus = "Available" | "Occupied" | "Maintenance";
export type CargoType = "Frozen" | "Normal" | "Mixed";

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
  vehicleNumber: string;
  licensePlate: string;
  shipmentCode: string;
  carrier: string;
  driver: string;
  driverContact?: string;
  transporter?: string;
  cargoType: CargoType;
  quantity: number;
  arrivalTime: string;
  actualArrivalTime?: string;
  appointmentTime?: string;
  estimatedArrivalTime: string;
  estimatedDockOutTime?: string;
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

export interface CargoTypeData {
  name: CargoType;
  value: number;
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

// Mock data for trucks with updated fields
export const trucks: Truck[] = [
  {
    id: "T123",
    vehicleNumber: "ABC-1234",
    licensePlate: "ABC-1234",
    shipmentCode: "SHIP-001",
    carrier: "FastFreight Inc.",
    driver: "John Smith",
    driverContact: "555-123-4567",
    transporter: "Global Transport Co",
    cargoType: "Frozen",
    quantity: 250,
    arrivalTime: "2025-04-08T08:30:00",
    actualArrivalTime: "2025-04-08T08:32:00",
    appointmentTime: "2025-04-08T08:30:00",
    estimatedArrivalTime: "2025-04-08T08:25:00",
    estimatedDockOutTime: "2025-04-08T10:45:00",
    status: "Assigned",
    assignedDock: "D2",
    priority: "Medium"
  },
  {
    id: "T456",
    vehicleNumber: "XYZ-7890",
    licensePlate: "XYZ-7890",
    shipmentCode: "SHIP-002",
    carrier: "Swift Logistics",
    driver: "Maria Garcia",
    driverContact: "555-789-0123",
    transporter: "Swift Transport Ltd",
    cargoType: "Normal",
    quantity: 180,
    arrivalTime: "2025-04-08T08:45:00",
    actualArrivalTime: "2025-04-08T08:50:00",
    appointmentTime: "2025-04-08T09:00:00",
    estimatedArrivalTime: "2025-04-08T08:45:00",
    estimatedDockOutTime: "2025-04-08T11:30:00",
    status: "Assigned",
    assignedDock: "D5",
    priority: "High"
  },
  {
    id: "T789",
    vehicleNumber: "DEF-4567",
    licensePlate: "DEF-4567",
    shipmentCode: "SHIP-003",
    carrier: "Global Transport",
    driver: "Robert Johnson",
    driverContact: "555-456-7890",
    transporter: "Global Logistics",
    cargoType: "Mixed",
    quantity: 320,
    arrivalTime: "2025-04-08T09:00:00",
    appointmentTime: "2025-04-08T09:15:00",
    estimatedArrivalTime: "2025-04-08T09:05:00",
    estimatedDockOutTime: "2025-04-08T12:15:00",
    status: "Assigned",
    assignedDock: "D7",
    priority: "Medium"
  },
  {
    id: "T234",
    vehicleNumber: "GHI-8901",
    licensePlate: "GHI-8901",
    shipmentCode: "SHIP-004",
    carrier: "Quick Shipping Co.",
    driver: "David Lee",
    cargoType: "Normal",
    quantity: 150,
    arrivalTime: "2025-04-08T09:15:00",
    estimatedArrivalTime: "2025-04-08T09:25:00",
    status: "In Queue",
    estimatedWaitTime: "45 minutes",
    priority: "Low"
  },
  {
    id: "T567",
    vehicleNumber: "JKL-2345",
    licensePlate: "JKL-2345",
    shipmentCode: "SHIP-005",
    carrier: "Express Freight",
    driver: "Susan Williams",
    driverContact: "555-234-5678",
    transporter: "Express Logistics",
    cargoType: "Frozen",
    quantity: 200,
    arrivalTime: "2025-04-08T09:30:00",
    appointmentTime: "2025-04-08T10:00:00",
    estimatedArrivalTime: "2025-04-08T09:35:00",
    estimatedDockOutTime: "2025-04-08T11:45:00",
    status: "In Queue",
    estimatedWaitTime: "1 hour",
    priority: "High"
  },
  {
    id: "T890",
    vehicleNumber: "MNO-6789",
    licensePlate: "MNO-6789",
    shipmentCode: "SHIP-006",
    carrier: "Reliable Transport",
    driver: "James Brown",
    cargoType: "Mixed",
    quantity: 230,
    arrivalTime: "2025-04-08T08:15:00",
    actualArrivalTime: "2025-04-08T08:10:00",
    appointmentTime: "2025-04-08T08:00:00",
    estimatedArrivalTime: "2025-04-08T08:05:00",
    estimatedDockOutTime: "2025-04-08T10:15:00",
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

// Mock data for cargo type distribution
export const cargoTypeData: CargoTypeData[] = [
  { name: "Frozen", value: 35 },
  { name: "Normal", value: 45 },
  { name: "Mixed", value: 20 }
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
