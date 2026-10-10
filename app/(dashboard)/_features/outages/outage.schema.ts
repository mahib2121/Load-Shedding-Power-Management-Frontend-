import { z } from "zod";

export const createOutageReportSchema = z.object({
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters"),
  latitude: z.union([z.number(), z.undefined()]),
  longitude: z.union([z.number(), z.undefined()]),
});

export type CreateOutageReportFormValues = z.infer<
  typeof createOutageReportSchema
>;
