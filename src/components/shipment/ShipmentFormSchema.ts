
import * as z from "zod";

export const shipmentFormSchema = z.object({
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

export type ShipmentFormValues = z.infer<typeof shipmentFormSchema>;
