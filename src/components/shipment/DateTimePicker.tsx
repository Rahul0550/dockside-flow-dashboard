
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl } from "@/components/ui/form";

interface DateTimePickerProps {
  field: ControllerRenderProps<any, any>;
  placeholder: string;
}

export function DateTimePicker({ field, placeholder }: DateTimePickerProps) {
  // Add a safety check for invalid date values
  const isValidDate = field.value ? isValid(new Date(field.value)) : false;
  
  return (
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
            {(field.value && isValidDate) ? (
              format(new Date(field.value), "PPP")
            ) : (
              <span>{placeholder}</span>
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
          selected={isValidDate ? new Date(field.value) : undefined}
          onSelect={field.onChange}
          initialFocus
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
