import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character",
    ),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  phone: z.string().min(7, "Please enter a valid phone number"),

  areaId: z.string().min(1, "Area is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),

  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
