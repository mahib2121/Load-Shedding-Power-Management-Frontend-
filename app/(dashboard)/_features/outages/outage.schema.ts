import { z } from "zod";

export const createOutageReportSchema = z.object({
  description: z
    .string()
    .trim()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .or(z.literal("")),

  latitude: z.number().min(-90).max(90).optional(),

  longitude: z.number().min(-180).max(180).optional(),
});

export type CreateOutageReportFormValues = z.infer<
  typeof createOutageReportSchema
>;
