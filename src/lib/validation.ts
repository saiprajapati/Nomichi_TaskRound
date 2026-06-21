import { z } from "zod";

export const groupTypeEnum = z.enum(["solo", "friends", "couple", "family"]);

const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tell us your name, at least two letters.")
    .max(80, "That is a long name. Try shortening it."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a 10-digit Indian mobile number."),
  email: z.string().trim().email("Enter a valid email address."),
  trip_id: z.string().uuid("Choose a trip from the list."),
  group_type: groupTypeEnum,
  preferred_month: z.string().trim().min(1, "Choose a month."),
  trip_feeling: z
    .string()
    .trim()
    .max(600, "Keep it under 600 characters, we will ask more on the call.")
    .optional()
    .default(""),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const tripSchema = z
  .object({
    name: z.string().trim().min(2, "Give the trip a name.").max(100),
    destination: z.string().trim().min(2, "Where is this trip to?").max(100),
    start_date: z.string().min(1, "Pick a start date."),
    end_date: z.string().min(1, "Pick an end date."),
    price_inr_gst: z.coerce
      .number({ message: "Enter a price." })
      .int("Whole rupees only.")
      .min(0, "Price cannot be negative."),
    total_seats: z.coerce
      .number({ message: "Enter total seats." })
      .int("Whole numbers only.")
      .min(1, "At least one seat."),
    status: z.enum(["open", "closed"]),
    description: z.string().trim().max(1000).optional().default(""),
  })
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    message: "End date should be on or after the start date.",
    path: ["end_date"],
  });

export type TripInput = z.infer<typeof tripSchema>;

export const leadNoteSchema = z.object({
  body: z.string().trim().min(1, "Write something before saving.").max(2000),
  next_action: z.string().trim().max(300).optional().default(""),
});

export type LeadNoteInput = z.infer<typeof leadNoteSchema>;
