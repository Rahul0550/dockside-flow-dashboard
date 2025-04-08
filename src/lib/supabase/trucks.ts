
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches all trucks from the database
 */
export const fetchTrucks = async () => {
  const { data, error } = await supabase
    .from('trucks')
    .select('*')
    .order('estimated_arrival_time', { ascending: true });
  
  if (error) {
    console.error('Error fetching trucks:', error);
    throw new Error('Failed to fetch trucks');
  }
  
  return data || [];
};
