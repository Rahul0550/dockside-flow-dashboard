
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Supabase client is automatically initialized with env variables 
// provided by the Lovable Supabase integration
export const supabase = createClient<Database>();

// Helper functions for data operations
export const fetchTrucks = async () => {
  const { data, error } = await supabase
    .from('trucks')
    .select('*');

  if (error) {
    console.error('Error fetching trucks:', error);
    throw error;
  }

  return data;
};

export const fetchDockDoors = async () => {
  const { data, error } = await supabase
    .from('dock_doors')
    .select('*');

  if (error) {
    console.error('Error fetching dock doors:', error);
    throw error;
  }

  return data;
};

export const fetchCargoTypeData = async () => {
  const { data, error } = await supabase
    .from('trucks')
    .select('cargo_type');

  if (error) {
    console.error('Error fetching cargo type data:', error);
    throw error;
  }

  // Group by cargo type and count
  const cargoTypeCounts: Record<string, number> = {};
  data.forEach(item => {
    const cargoType = item.cargo_type;
    cargoTypeCounts[cargoType] = (cargoTypeCounts[cargoType] || 0) + 1;
  });

  return Object.entries(cargoTypeCounts).map(([name, value]) => ({
    name: name as "Frozen" | "Normal" | "Mixed",
    value
  }));
};

export const addTruck = async (truckData: Omit<Database['public']['Tables']['trucks']['Insert'], 'id'>) => {
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
  const { data, error } = await supabase
    .from('trucks')
    .update({ 
      status, 
      ...(dockId && { assigned_dock: dockId })
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating truck status:', error);
    throw error;
  }

  return data?.[0];
};

export const updateDockStatus = async (id: string, status: string, truckId?: string) => {
  const { data, error } = await supabase
    .from('dock_doors')
    .update({ 
      status, 
      ...(truckId && { assigned_truck: truckId })
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating dock status:', error);
    throw error;
  }

  return data?.[0];
};
