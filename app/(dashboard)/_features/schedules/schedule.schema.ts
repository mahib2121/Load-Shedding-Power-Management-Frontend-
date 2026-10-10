import { z } from "zod";

// `ICreateSchedulePayload` from the backend service. `requiredReductionMW`
// is server-computed (max(expected - available, 0)) so it is NOT a
// client field. If the backend has stricter rules (e.g. min name length),
// the API will return a 400 with a message that the form shows verbatim.
export const createScheduleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name must be 200 characters or less"),

  date: z.string().min(1, "Date is required"),

  zoneId: z.string().min(1, "Zone is required"),

  expectedDemandMW: z
    .number({ message: "Expected demand is required" })
    .positive("Expected demand must be greater than 0")
    .max(100_000, "Expected demand is too large"),

  availableSupplyMW: z
    .number({ message: "Available supply is required" })
    .nonnegative("Available supply cannot be negative")
    .max(100_000, "Available supply is too large"),
});

export type CreateScheduleFormValues = z.infer<typeof createScheduleSchema>;

// `ICreateScheduleSlotPayload` from the backend service.
// The backend computes and validates `durationHours` so the form
// must send it explicitly (1 or 2 hours, matching startTime/endTime).
export const addSlotSchema = z
  .object({
    feederId: z.string().min(1, "Feeder is required"),

    startTime: z.string().min(1, "Start time is required"),

    endTime: z.string().min(1, "End time is required"),

    durationHours: z.number().superRefine((value, ctx) => {
      if (value !== 1 && value !== 2) {
        ctx.addIssue({
          code: "custom",
          message: "Duration must be exactly 1 or 2 hours",
        });
      }
    }),

    plannedLoadReductionMW: z
      .number({ message: "Planned reduction is required" })
      .positive("Planned reduction must be greater than 0"),
  })
  .refine(
    (value) => {
      const start = new Date(value.startTime).getTime();
      const end = new Date(value.endTime).getTime();

      if (Number.isNaN(start) || Number.isNaN(end)) return true;

      return end > start;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

export type AddSlotFormValues = z.infer<typeof addSlotSchema>;
