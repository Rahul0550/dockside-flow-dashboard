
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addShipment, checkShipmentExists } from "@/lib/supabase";
import { addVehicleMaster, checkVehicleExists } from "@/lib/supabase/vehicles";
import { shipmentFormSchema, ShipmentFormValues } from "./ShipmentFormSchema";
import { DialogFooter } from "@/components/ui/dialog";
import { CargoTypeSelector } from "./CargoTypeSelector";
import { DateTimePicker } from "./DateTimePicker";

interface ShipmentFormProps {
  onSuccess: () => void;
}

export function ShipmentForm({ onSuccess }: ShipmentFormProps) {
  const [selectedCargoTypes, setSelectedCargoTypes] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentFormSchema),
    defaultValues: {
      vehicleNumber: "",
      vehicleType: "",
      shipmentCode: "",
      cargoTypes: [],
      quantity: undefined,
      driverName: "",
      driverContact: "",
      transporter: "",
      eta: undefined,
      appointmentTime: undefined,
    },
  });
  
  const onSubmit = async (data: ShipmentFormValues) => {
    try {
      const shipmentExists = await checkShipmentExists(data.shipmentCode);
      if (shipmentExists) {
        toast({
          title: "Shipment already exists",
          description: `A shipment with code ${data.shipmentCode} already exists.`,
          variant: "destructive"
        });
        return;
      }
      
      const vehicleExists = await checkVehicleExists(data.vehicleNumber);
      if (!vehicleExists) {
        await addVehicleMaster({
          vehicle_number: data.vehicleNumber,
          vehicle_type: data.vehicleType
        });
      }
      
      // Convert dates to ISO strings if they exist
      const shipmentData = {
        shipment_code: data.shipmentCode,
        vehicle_number: data.vehicleNumber,
        cargo_types: data.cargoTypes,
        quantity: data.quantity!,
        eta: data.eta ? new Date(data.eta).toISOString() : null,
        appointment_time: data.appointmentTime ? new Date(data.appointmentTime).toISOString() : null,
        driver_name: data.driverName || null,
        driver_contact: data.driverContact || null,
        transporter: data.transporter || null
      };
      
      await addShipment(shipmentData);
      
      queryClient.invalidateQueries({ queryKey: ['truckQueue'] });
      
      toast({
        title: "Shipment Added",
        description: `Shipment ${data.shipmentCode} has been added successfully.`,
      });
      
      onSuccess();
      form.reset();
      setSelectedCargoTypes([]);
    } catch (error) {
      console.error("Error adding shipment:", error);
      toast({
        title: "Error",
        description: "Failed to add shipment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shipmentCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right">
                  Shipment Code <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. SHIP-001" {...field} />
                </FormControl>
                <FormDescription>Unique identifier for the shipment</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vehicleNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right">
                  Vehicle Number <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. ABC-1234" {...field} />
                </FormControl>
                <FormDescription>Vehicle identification number</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right">
                  Vehicle Type <span className="text-destructive">*</span>
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                    <SelectItem value="Container">Container</SelectItem>
                    <SelectItem value="Refrigerated">Refrigerated Truck</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Type of vehicle</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <CargoTypeSelector 
            control={form.control} 
            selectedTypes={selectedCargoTypes}
            onSelectionChange={setSelectedCargoTypes}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Quantity <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 200" 
                    {...field}
                  />
                </FormControl>
                <FormDescription>Number of cases per cargo type</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  ETA
                </FormLabel>
                <DateTimePicker 
                  field={field}
                  placeholder="Pick a date and time"
                />
                <FormDescription>Estimated arrival time (optional)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appointment Time</FormLabel>
                <DateTimePicker 
                  field={field}
                  placeholder="Pick a date and time"
                />
                <FormDescription>Scheduled dock appointment (optional)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="driverName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Smith" {...field} />
                </FormControl>
                <FormDescription>Driver name (optional)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="driverContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver Contact</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 555-123-4567" {...field} />
                </FormControl>
                <FormDescription>Driver contact number (optional)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="transporter"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Transporter</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Global Transport Co." {...field} />
                </FormControl>
                <FormDescription>Transport vendor (optional)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button type="submit">Add Shipment</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
