
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormItem, FormLabel } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { ShipmentFormValues } from "./ShipmentFormSchema";

interface CargoTypeSelectorProps {
  control: Control<ShipmentFormValues>;
  selectedTypes: string[];
  onSelectionChange: (types: string[]) => void;
}

export function CargoTypeSelector({ control, selectedTypes, onSelectionChange }: CargoTypeSelectorProps) {
  const handleCargoTypeChange = (cargoType: string) => {
    const updatedTypes = selectedTypes.includes(cargoType)
      ? selectedTypes.filter(type => type !== cargoType)
      : [...selectedTypes, cargoType];
    
    // Update form values
    control._formValues.cargoTypes = updatedTypes;
    // Update parent component state
    onSelectionChange(updatedTypes);
  };

  return (
    <FormItem>
      <FormLabel>
        Cargo Types <span className="text-destructive">*</span>
      </FormLabel>
      <FormControl>
        <div className="flex flex-wrap gap-2">
          <Button 
            type="button" 
            variant={selectedTypes.includes("Frozen") ? "default" : "outline"}
            size="sm"
            onClick={() => handleCargoTypeChange("Frozen")}
          >
            Frozen
          </Button>
          <Button 
            type="button" 
            variant={selectedTypes.includes("Normal") ? "default" : "outline"}
            size="sm"
            onClick={() => handleCargoTypeChange("Normal")}
          >
            Normal
          </Button>
          <Button 
            type="button" 
            variant={selectedTypes.includes("Mixed") ? "default" : "outline"}
            size="sm"
            onClick={() => handleCargoTypeChange("Mixed")}
          >
            Mixed
          </Button>
        </div>
      </FormControl>
      <FormDescription>Select one or more cargo types</FormDescription>
      {control.getFieldState("cargoTypes").error && (
        <p className="text-sm font-medium text-destructive">
          {control.getFieldState("cargoTypes").error?.message}
        </p>
      )}
    </FormItem>
  );
}
