
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Truck } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const vehicleFormSchema = z.object({
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  shipmentCode: z.string().min(1, "Shipment code is required"),
  cargoType: z.enum(["Frozen", "Normal", "Both"], {
    required_error: "Please select a cargo type",
  }),
  quantity: z.string().min(1, "Quantity is required"),
  estimatedArrival: z.string().min(1, "ETA is required"),
  appointmentTime: z.string().optional(),
  driverName: z.string().optional(),
  driverContact: z.string().optional(),
  transporter: z.string().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface AddVehicleDialogProps {
  onAddVehicle: (vehicle: Partial<Truck>) => void;
}

export function AddVehicleDialog({ onAddVehicle }: AddVehicleDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vehicleNumber: "",
      shipmentCode: "",
      cargoType: "Normal",
      quantity: "",
      estimatedArrival: "",
      appointmentTime: "",
      driverName: "",
      driverContact: "",
      transporter: "",
    },
  });

  function onSubmit(data: VehicleFormValues) {
    // Convert form data to truck format
    const newVehicle: Partial<Truck> = {
      id: `T${Math.floor(Math.random() * 1000)}`,
      licensePlate: data.vehicleNumber,
      carrier: data.transporter || "Not specified",
      driver: data.driverName || "Not specified",
      arrivalTime: data.estimatedArrival,
      appointmentTime: data.appointmentTime || undefined,
      status: "In Queue",
      priority: "Medium",
      cargoType: data.cargoType, 
      quantity: data.quantity,
      shipmentCode: data.shipmentCode,
    };

    onAddVehicle(newVehicle);
    toast({
      title: "Vehicle added",
      description: `Vehicle ${data.vehicleNumber} has been added to the queue`,
    });
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Vehicle</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Enter the vehicle details to add it to the queue
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicleNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipmentCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipment Code*</FormLabel>
                    <FormControl>
                      <Input placeholder="SHP-123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cargoType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo Type*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cargo type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Frozen">Frozen</SelectItem>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Both">Both (Mixed)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity*</FormLabel>
                    <FormControl>
                      <Input placeholder="Number of cases" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estimatedArrival"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Arrival Time*</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="driverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="driverContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transporter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transporter</FormLabel>
                    <FormControl>
                      <Input placeholder="Transport company" {...field} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">Add Vehicle</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
