
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches all trucks from the database
 */
export const fetchTrucks = async () => {
  const { data, error } = await supabase
    .from('shipment')  // Changed from 'trucks' to 'shipment'
    .select('*')
    .order('eta', { ascending: true });
  
  if (error) {
    console.error('Error fetching trucks:', error);
    throw new Error('Failed to fetch trucks');
  }
  
  return data || [];
};
