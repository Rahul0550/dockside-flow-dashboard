
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Dock in the next available vehicle in queue to a dock door
 */
export const dockInVehicle = async (dockId: string, shipmentCode?: string) => {
  try {
    // If shipment code is not provided, find the next available shipment
    if (!shipmentCode) {
      // Get next available shipment that has no dock assigned yet
      const { data: nextShipment, error: shipmentError } = await supabase
        .from('shipment')
        .select('shipment_code')
        .is('dockdoor_assigned', null)
        .is('dock_in_time', null)
        .order('eta', { ascending: true })
        .limit(1)
        .maybeSingle();  // Changed from single() to maybeSingle() to handle no results gracefully
      
      if (shipmentError) {
        console.error('Error finding available shipments:', shipmentError);
        toast.error('Error finding available shipments');
        throw new Error('Error finding available shipments');
      }
      
      if (!nextShipment) {
        toast.error('No vehicles available in the queue');
        throw new Error('No available shipments found');
      }
      
      shipmentCode = nextShipment.shipment_code;
    }
    
    console.log('Selected shipment code:', shipmentCode);
    
    // Check if dock is available - make status check case-insensitive
    const { data: dockData, error: dockCheckError } = await supabase
      .from('dock_master')
      .select('status')
      .eq('dock_id', dockId)
      .single();
      
    if (dockCheckError) {
      console.error('Error checking dock status:', dockCheckError);
      throw new Error('Failed to check dock status');
    }
    
    // Make the status check case-insensitive
    const normalizedStatus = dockData.status.toLowerCase();
    if (normalizedStatus !== 'available') {
      toast.error(`Dock is not available. Current status: ${dockData.status}`);
      throw new Error(`Dock is not available. Current status: ${dockData.status}`);
    }

    // Update the dock status to Occupied
    const { error: dockUpdateError } = await supabase
      .from('dock_master')
      .update({ status: 'OCCUPIED' })
      .eq('dock_id', dockId);
    
    if (dockUpdateError) {
      console.error('Error updating dock status:', dockUpdateError);
      throw new Error('Failed to update dock status');
    }
    
    // Update the shipment with dock information and dock_in_time
    const { error: shipmentUpdateError } = await supabase
      .from('shipment')
      .update({
        dockdoor_assigned: dockId,
        dock_in_time: new Date().toISOString()
      })
      .eq('shipment_code', shipmentCode);
    
    if (shipmentUpdateError) {
      console.error('Error updating shipment:', shipmentUpdateError);
      // Revert dock status on error
      await supabase
        .from('dock_master')
        .update({ status: 'AVAILABLE' })
        .eq('dock_id', dockId);
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
    // First, verify the dock is currently OCCUPIED and has the correct shipment assigned
    const { data: dockData, error: dockCheckError } = await supabase
      .from('dock_master')
      .select('status')
      .eq('dock_id', dockId)
      .single();
      
    if (dockCheckError) {
      console.error('Error checking dock status:', dockCheckError);
      throw new Error('Failed to check dock status');
    }
    
    // Make the status check case-insensitive
    const normalizedStatus = dockData.status.toLowerCase();
    if (normalizedStatus !== 'occupied') {
      toast.error(`Dock is not occupied. Current status: ${dockData.status}`);
      throw new Error(`Dock is not occupied. Current status: ${dockData.status}`);
    }
    
    // Verify shipment is assigned to this dock
    const { data: shipmentData, error: shipmentCheckError } = await supabase
      .from('shipment')
      .select('dockdoor_assigned')
      .eq('shipment_code', shipmentCode)
      .single();
      
    if (shipmentCheckError) {
      console.error('Error checking shipment:', shipmentCheckError);
      throw new Error('Failed to check shipment');
    }
    
    if (shipmentData.dockdoor_assigned !== dockId) {
      toast.error('Shipment is not assigned to this dock');
      throw new Error('Shipment is not assigned to this dock');
    }
    
    // Update the dock status to Available
    const { error: dockUpdateError } = await supabase
      .from('dock_master')
      .update({ status: 'AVAILABLE' })
      .eq('dock_id', dockId);
    
    if (dockUpdateError) {
      console.error('Error updating dock status:', dockUpdateError);
      throw new Error('Failed to update dock status');
    }
    
    // Update the shipment with dock_out_time
    const { error: shipmentUpdateError } = await supabase
      .from('shipment')
      .update({
        dock_out_time: new Date().toISOString()
      })
      .eq('shipment_code', shipmentCode)
      .eq('dockdoor_assigned', dockId);
    
    if (shipmentUpdateError) {
      console.error('Error updating shipment:', shipmentUpdateError);
      // Revert dock status on error
      await supabase
        .from('dock_master')
        .update({ status: 'OCCUPIED' })
        .eq('dock_id', dockId);
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
 * Block or unblock a dock door
 */
export const blockDock = async (dockId: string, isBlocked: boolean) => {
  try {
    const status = isBlocked ? 'UNDER_MAINTENANCE' : 'AVAILABLE';
    
    const { data, error } = await supabase
      .from('dock_master')
      .update({ status })
      .eq('dock_id', dockId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating dock status:', error);
      throw new Error('Failed to update dock status');
    }
    
    toast.success(`Dock ${data.dock_name} ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
    return data;
  } catch (error) {
    console.error('Error in blockDock:', error);
    toast.error(`Failed to ${isBlocked ? 'block' : 'unblock'} dock`);
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
