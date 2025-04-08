
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { addShipment, addVehicleMaster, checkShipmentExists, checkVehicleExists } from "@/lib/supabase";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  vehicleNumber: z.string().min(1, "Vehicle Number is required"),
  vehicleType: z.string().min(1, "Vehicle Type is required"),
  shipmentCode: z.string().min(1, "Shipment Code is required"),
  cargoTypes: z.array(z.string()).min(1, "At least one cargo type is required"),
  quantity: z.coerce.number().positive("Quantity must be a positive number"),
  eta: z.date({
    required_error: "ETA is required",
  }).optional(),
  appointmentTime: z.date().optional(),
  driverName: z.string().optional(),
  driverContact: z.string().optional(),
  transporter: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddShipmentForm() {
  const [open, setOpen] = useState(false);
  const [selectedCargoTypes, setSelectedCargoTypes] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleNumber: "",
      vehicleType: "",
      shipmentCode: "",
      cargoTypes: [],
      quantity: undefined,
      driverName: "",
      driverContact: "",
      transporter: "",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      // Check if shipment with this code already exists
      const shipmentExists = await checkShipmentExists(data.shipmentCode);
      if (shipmentExists) {
        toast({
          title: "Shipment already exists",
          description: `A shipment with code ${data.shipmentCode} already exists.`,
          variant: "destructive"
        });
        return;
      }
      
      // Check if vehicle exists, if not create it
      const vehicleExists = await checkVehicleExists(data.vehicleNumber);
      if (!vehicleExists) {
        await addVehicleMaster({
          vehicle_number: data.vehicleNumber,
          vehicle_type: data.vehicleType
        });
      }
      
      // Create the shipment
      const shipmentData = {
        shipment_code: data.shipmentCode,
        vehicle_number: data.vehicleNumber,
        cargo_types: data.cargoTypes,
        quantity: data.quantity!,
        eta: data.eta ? data.eta.toISOString() : null,
        appointment_time: data.appointmentTime ? data.appointmentTime.toISOString() : null,
        driver_name: data.driverName || null,
        driver_contact: data.driverContact || null,
        transporter: data.transporter || null
      };
      
      await addShipment(shipmentData);
      
      // Refresh the truck queue data
      queryClient.invalidateQueries({ queryKey: ['truckQueue'] });
      
      toast({
        title: "Shipment Added",
        description: `Shipment ${data.shipmentCode} has been added successfully.`,
      });
      
      // Close the dialog and reset form
      setOpen(false);
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

  const handleCargoTypeChange = (cargoType: string) => {
    setSelectedCargoTypes(prev => {
      if (prev.includes(cargoType)) {
        const updated = prev.filter(type => type !== cargoType);
        form.setValue('cargoTypes', updated);
        return updated;
      } else {
        const updated = [...prev, cargoType];
        form.setValue('cargoTypes', updated);
        return updated;
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">Add Shipment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Shipment</DialogTitle>
          <DialogDescription>
            Enter the details of the shipment to add it to the queue.
          </DialogDescription>
        </DialogHeader>
        
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

              <FormField
                control={form.control}
                name="cargoTypes"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Cargo Types <span className="text-destructive">*</span>
                    </FormLabel>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        type="button" 
                        variant={selectedCargoTypes.includes("Frozen") ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCargoTypeChange("Frozen")}
                      >
                        Frozen
                      </Button>
                      <Button 
                        type="button" 
                        variant={selectedCargoTypes.includes("Normal") ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCargoTypeChange("Normal")}
                      >
                        Normal
                      </Button>
                      <Button 
                        type="button" 
                        variant={selectedCargoTypes.includes("Mixed") ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCargoTypeChange("Mixed")}
                      >
                        Mixed
                      </Button>
                    </div>
                    <FormDescription>Select one or more cargo types</FormDescription>
                    {form.formState.errors.cargoTypes && (
                      <p className="text-sm font-medium text-destructive">{form.formState.errors.cargoTypes.message}</p>
                    )}
                  </FormItem>
                )}
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP p")
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                            {field.value ? (
                              <X 
                                className="ml-auto h-4 w-4 opacity-50 hover:opacity-100" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  field.onChange(undefined);
                                }}
                              />
                            ) : (
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP p")
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                            {field.value ? (
                              <X 
                                className="ml-auto h-4 w-4 opacity-50 hover:opacity-100" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  field.onChange(undefined);
                                }}
                              />
                            ) : (
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Shipment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
