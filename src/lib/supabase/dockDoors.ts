
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches all dock doors from the database
 */
export const fetchDockDoors = async () => {
  const { data, error } = await supabase
    .from('dock_master')  // Changed from 'dock_doors' to 'dock_master'
    .select('*')
    .order('dock_name', { ascending: true });
  
  if (error) {
    console.error('Error fetching dock doors:', error);
    throw new Error('Failed to fetch dock doors');
  }
  
  return data || [];
};
