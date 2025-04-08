
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches all vehicles from the database
 */
export const fetchVehicles = async () => {
  const { data, error } = await supabase
    .from('vehicle_master')
    .select('*')
    .order('vehicle_number', { ascending: true });
  
  if (error) {
    console.error('Error fetching vehicles:', error);
    throw new Error('Failed to fetch vehicles');
  }
  
  return data || [];
};

/**
 * Fetches a specific vehicle by its number
 */
export const fetchVehicleByNumber = async (vehicleNumber: string) => {
  const { data, error } = await supabase
    .from('vehicle_master')
    .select('*')
    .eq('vehicle_number', vehicleNumber)
    .single();
  
  if (error) {
    console.error('Error fetching vehicle:', error);
    throw new Error('Failed to fetch vehicle');
  }
  
  return data;
};

/**
 * Adds a new vehicle to the database
 */
export const addVehicle = async (vehicleNumber: string, vehicleType: string) => {
  const { data, error } = await supabase
    .from('vehicle_master')
    .insert([
      { 
        vehicle_number: vehicleNumber,
        vehicle_type: vehicleType
      }
    ])
    .select();
  
  if (error) {
    console.error('Error adding vehicle:', error);
    throw new Error('Failed to add vehicle');
  }
  
  return data?.[0];
};
