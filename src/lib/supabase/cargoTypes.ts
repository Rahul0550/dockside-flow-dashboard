
import { supabase } from "@/integrations/supabase/client";
import { CargoTypeData } from "@/lib/data";

/**
 * Fetches cargo type distribution data from the database
 */
export const fetchCargoTypeData = async (): Promise<CargoTypeData[]> => {
  const { data, error } = await supabase
    .from('shipment')
    .select('cargo_types');
  
  if (error) {
    console.error('Error fetching cargo type data:', error);
    throw new Error('Failed to fetch cargo type data');
  }
  
  // Process the data to get cargo type distribution
  const cargoTypeCounts: Record<string, number> = {};
  
  data.forEach(item => {
    if (item.cargo_types && Array.isArray(item.cargo_types)) {
      item.cargo_types.forEach(cargoType => {
        cargoTypeCounts[cargoType] = (cargoTypeCounts[cargoType] || 0) + 1;
      });
    }
  });
  
  // Convert to CargoTypeData format
  const result: CargoTypeData[] = Object.entries(cargoTypeCounts).map(([name, value]) => ({
    name,
    value
  }));
  
  // If no data, return default data
  if (result.length === 0) {
    return [
      { name: "Frozen", value: 8 },
      { name: "Normal", value: 15 },
      { name: "Mixed", value: 5 }
    ];
  }
  
  return result;
};
