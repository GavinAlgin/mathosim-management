import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date(),
  endDate: z.date(),
  color: z.enum(["blue", "green", "red", "yellow", "purple", "orange"]),
});

export type EventFormInput = z.input<typeof eventSchema>;
export type EventFormOutput = z.output<typeof eventSchema>; // same as z.infer
