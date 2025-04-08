
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Dock in a vehicle to a dock door
 */
export const dockInVehicle = async (dockId: string, shipmentCode: string) => {
  try {
    // Update the dock status to Occupied
    const dockUpdate = await supabase
      .from('dock_master')
      .update({ status: 'Occupied' })
      .eq('dock_id', dockId);
    
    if (dockUpdate.error) {
      console.error('Error updating dock status:', dockUpdate.error);
      throw new Error('Failed to update dock status');
    }
    
    // Update the shipment with dock information and dock_in_time
    const shipmentUpdate = await supabase
      .from('shipment')
      .update({
        dockdoor_assigned: dockId,
        dock_in_time: new Date().toISOString()
      })
      .eq('shipment_code', shipmentCode);
    
    if (shipmentUpdate.error) {
      console.error('Error updating shipment:', shipmentUpdate.error);
      throw new Error('Failed to update shipment');
    }
    
    toast.success(`Vehicle with shipment ${shipmentCode} docked in successfully`);
    return true;
  } catch (error) {
    console.error('Error in dockInVehicle:', error);
    toast.error('Failed to dock in vehicle');
    throw error;
  }
};

/**
 * Dock out a vehicle from a dock door
 */
export const dockOutVehicle = async (dockId: string, shipmentCode: string) => {
  try {
    // Update the dock status to Available
    const dockUpdate = await supabase
      .from('dock_master')
      .update({ status: 'Available' })
      .eq('dock_id', dockId);
    
    if (dockUpdate.error) {
      console.error('Error updating dock status:', dockUpdate.error);
      throw new Error('Failed to update dock status');
    }
    
    // Update the shipment with dock_out_time
    const shipmentUpdate = await supabase
      .from('shipment')
      .update({
        dock_out_time: new Date().toISOString()
      })
      .eq('shipment_code', shipmentCode)
      .eq('dockdoor_assigned', dockId);
    
    if (shipmentUpdate.error) {
      console.error('Error updating shipment:', shipmentUpdate.error);
      throw new Error('Failed to update shipment');
    }
    
    toast.success(`Vehicle with shipment ${shipmentCode} docked out successfully`);
    return true;
  } catch (error) {
    console.error('Error in dockOutVehicle:', error);
    toast.error('Failed to dock out vehicle');
    throw error;
  }
};

/**
 * Update a dock door's information
 */
export const updateDockDoor = async (
  dockId: string, 
  data: {
    status?: string,
    product_type?: string | null,
    vehicle_type_compatibility?: string[]
  }
) => {
  try {
    const { data: updateData, error } = await supabase
      .from('dock_master')
      .update(data)
      .eq('dock_id', dockId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating dock door:', error);
      throw new Error('Failed to update dock door');
    }
    
    toast.success(`Dock ${updateData.dock_name} updated successfully`);
    return updateData;
  } catch (error) {
    console.error('Error in updateDockDoor:', error);
    toast.error('Failed to update dock door');
    throw error;
  }
};
