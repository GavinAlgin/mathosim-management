import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type {
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useCalendar } from "@/components/calendar-context";

/**
 * Generic props:
 * - TFieldValues: the form shape
 * - TName: a single field name (startDate OR endDate)
 */
interface DateTimePickerProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> {
  form: UseFormReturn<TFieldValues>;
  field: ControllerRenderProps<TFieldValues, TName>;
  label?: string;
}

export function DateTimePicker<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>({
  form,
  field,
  label,
}: DateTimePickerProps<TFieldValues, TName>) {
  const { use24HourFormat } = useCalendar();

  const value = field.value as Date | undefined;

  function handleDateSelect(date: Date | undefined) {
    if (!date) return;
    form.setValue(field.name, date as any, { shouldDirty: true });
  }

  function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
    const currentDate = (form.getValues(field.name) as Date) ?? new Date();
    const newDate = new Date(currentDate);

    if (type === "hour") {
      newDate.setHours(parseInt(value, 10));
    }

    if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    }

    if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) newDate.setHours(hours - 12);
      if (value === "PM" && hours < 12) newDate.setHours(hours + 12);
    }

    form.setValue(field.name, newDate as any, { shouldDirty: true });
  }

  return (
    <FormItem className="flex flex-col">
      <FormLabel>
        {label ?? (field.name === "startDate" ? "Start Date" : "End Date")}
      </FormLabel>

      <Popover modal>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              {value ? (
                format(
                  value,
                  use24HourFormat
                    ? "MM/dd/yyyy HH:mm"
                    : "MM/dd/yyyy hh:mm aa"
                )
              ) : (
                <span>MM/DD/YYYY hh:mm aa</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <div className="sm:flex">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              initialFocus
            />

            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
              {/* HOURS */}
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from(
                    { length: use24HourFormat ? 24 : 12 },
                    (_, i) => i
                  ).map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={
                        value &&
                        value.getHours() %
                          (use24HourFormat ? 24 : 12) ===
                          hour %
                            (use24HourFormat ? 24 : 12)
                          ? "default"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() =>
                        handleTimeChange("hour", hour.toString())
                      }
                    >
                      {hour.toString().padStart(2, "0")}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>

              {/* MINUTES */}
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={
                        value && value.getMinutes() === minute
                          ? "default"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() =>
                        handleTimeChange("minute", minute.toString())
                      }
                    >
                      {minute.toString().padStart(2, "0")}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <FormMessage />
    </FormItem>
  );
}
