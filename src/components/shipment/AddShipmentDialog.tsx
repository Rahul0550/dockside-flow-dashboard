
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { ShipmentForm } from "./ShipmentForm";

interface AddShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddShipmentDialog({ open, onOpenChange }: AddShipmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Shipment</DialogTitle>
          <DialogDescription>
            Enter the details of the shipment to add it to the queue.
          </DialogDescription>
        </DialogHeader>
        
        <ShipmentForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
