import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().min(1, "Description is required"),

  startDate: z.coerce.date().refine(
    (date) => !isNaN(date.getTime()),
    { message: "Start date is required" }
  ),

  endDate: z.coerce.date().refine(
    (date) => !isNaN(date.getTime()),
    { message: "End date is required" }
  ),

  color: z.enum(["blue", "green", "red", "yellow", "purple", "orange"]).refine(
    Boolean,
    { message: "Variant is required" }
  ),
});

export type TEventFormData = z.infer<typeof eventSchema>;
