
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Supabase client is automatically initialized with env variables 
// provided by the Lovable Supabase integration
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// Helper functions for data operations
export const fetchTrucks = async () => {
  const { data, error } = await supabase
    .from('trucks')
    .select('*');

  if (error) {
    console.error('Error fetching trucks:', error);
    throw error;
  }

  return data || [];
};

export const fetchDockDoors = async () => {
  const { data, error } = await supabase
    .from('dock_doors')
    .select('*');

  if (error) {
    console.error('Error fetching dock doors:', error);
    throw error;
  }

  return data || [];
};

export const fetchCargoTypeData = async () => {
  const { data, error } = await supabase
    .from('trucks')
    .select('cargo_type');

  if (error) {
    console.error('Error fetching cargo type data:', error);
    throw error;
  }

  // Ensure we're working with valid data
  const validData = data || [];
  
  // Group by cargo type and count
  const cargoTypeCounts: Record<string, number> = {};
  validData.forEach(item => {
    if (item && typeof item === 'object' && 'cargo_type' in item) {
      const cargoType = item.cargo_type;
      cargoTypeCounts[cargoType] = (cargoTypeCounts[cargoType] || 0) + 1;
    }
  });

  return Object.entries(cargoTypeCounts).map(([name, value]) => ({
    name: name as "Frozen" | "Normal" | "Mixed",
    value
  }));
};

export const addTruck = async (truckData: {
  vehicle_number: string;
  license_plate: string;
  shipment_code: string;
  carrier: string;
  driver: string;
  driver_contact?: string;
  transporter?: string;
  cargo_type: "Frozen" | "Normal" | "Mixed";
  quantity: number;
  arrival_time: string;
  actual_arrival_time?: string;
  appointment_time?: string;
  estimated_arrival_time: string;
  estimated_dock_out_time?: string;
  status?: "In Queue" | "Assigned" | "Completed";
  assigned_dock?: string;
  estimated_wait_time?: string;
  priority?: "Low" | "Medium" | "High";
}) => {
  const { data, error } = await supabase
    .from('trucks')
    .insert(truckData)
    .select();

  if (error) {
    console.error('Error adding truck:', error);
    throw error;
  }

  return data?.[0];
};

export const updateTruckStatus = async (id: string, status: string, dockId?: string) => {
  const updateData: Record<string, any> = { status };
  if (dockId) {
    updateData.assigned_dock = dockId;
  }

  const { data, error } = await supabase
    .from('trucks')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating truck status:', error);
    throw error;
  }

  return data?.[0];
};

export const updateDockStatus = async (id: string, status: string, truckId?: string) => {
  const updateData: Record<string, any> = { status };
  if (truckId) {
    updateData.assigned_truck = truckId;
  }

  const { data, error } = await supabase
    .from('dock_doors')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating dock status:', error);
    throw error;
  }

  return data?.[0];
};
