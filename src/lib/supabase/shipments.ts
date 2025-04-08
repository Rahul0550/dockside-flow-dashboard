
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a shipment with the given code already exists
 */
export const checkShipmentExists = async (shipmentCode: string) => {
  const { data, error } = await supabase
    .from('shipment')
    .select('shipment_code')
    .eq('shipment_code', shipmentCode)
    .maybeSingle();
  
  if (error) {
    console.error('Error checking shipment existence:', error);
    throw new Error('Failed to check shipment existence');
  }
  
  return !!data;
};

/**
 * Add a new shipment
 */
export interface ShipmentInsert {
  shipment_code: string;
  vehicle_number: string;
  cargo_types: string[];
  quantity: number;
  eta: string | null;
  appointment_time: string | null;
  driver_name: string | null;
  driver_contact: string | null;
  transporter: string | null;
  dock_in_time?: string | null;
  dock_out_time?: string | null;
  dockdoor_assigned?: string | null;
}

export const addShipment = async (shipment: ShipmentInsert) => {
  const { data, error } = await supabase
    .from('shipment')
    .insert(shipment)
    .select('*')
    .single();
  
  if (error) {
    console.error('Error adding shipment:', error);
    throw new Error('Failed to add shipment');
  }
  
  return data;
};

/**
 * Fetches all shipments from the database
 */
export const fetchShipments = async () => {
  const { data, error } = await supabase
    .from('shipment')
    .select('*')
    .order('creation_timestamp', { ascending: false });
  
  if (error) {
    console.error('Error fetching shipments:', error);
    throw new Error('Failed to fetch shipments');
  }
  
  return data || [];
};
