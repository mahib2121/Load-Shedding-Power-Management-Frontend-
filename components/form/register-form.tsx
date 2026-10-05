"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/app/(auth)/_features/auth.schima";

// import { registerSchema } from "../_schemas/auth.schema";
import { useRegistration } from "@/app/(auth)/_features/auth.hook";

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegistration();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      areaId: "",
    },

    validators: {
      onSubmit: registerSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        await registerMutation.mutateAsync(value);

        toast.success("Account created successfully");

        router.push("/login");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create account",
        );
      }
    },
  });

  return (
    <div className="space-y-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        {/* Name */}
        <form.Field name="name">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Full name</Label>

              <Input
                id={field.name}
                name={field.name}
                placeholder="Enter your full name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={registerMutation.isPending}
              />

              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Email */}
        <form.Field name="email">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Email</Label>

              <Input
                id={field.name}
                name={field.name}
                type="email"
                placeholder="you@example.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={registerMutation.isPending}
              />

              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Phone */}
        <form.Field name="phone">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Phone number</Label>

              <Input
                id={field.name}
                name={field.name}
                type="tel"
                placeholder="01XXXXXXXXX"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={registerMutation.isPending}
              />

              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Area ID */}
        <form.Field name="areaId">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Area ID</Label>

              <Input
                id={field.name}
                name={field.name}
                placeholder="Enter your area ID"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={registerMutation.isPending}
              />

              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Password */}
        <form.Field name="password">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Password</Label>

              <Input
                id={field.name}
                name={field.name}
                type="password"
                placeholder="Create a strong password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={registerMutation.isPending}
              />

              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending
            ? "Creating account..."
            : "Create account"}
        </Button>
      </form>

      {/* Login link */}
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
