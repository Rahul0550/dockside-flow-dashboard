
import { Button } from "@/components/ui/button";
import { AddShipmentDialog } from "./AddShipmentDialog";
import { useState } from "react";

export function AddShipmentButton() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button className="ml-auto" onClick={() => setOpen(true)}>Add Shipment</Button>
      <AddShipmentDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
