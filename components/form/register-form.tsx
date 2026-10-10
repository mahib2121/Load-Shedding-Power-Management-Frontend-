"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/app/(auth)/_features/auth.schima";
import { useRegistration } from "@/app/(auth)/_features/auth.hook";
import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";

interface Area {
  id: string;
  name: string;
  code: string;
}

async function getAreas() {
  return api<ApiResponse<Area[]>>("/api/v1/areas");
}

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegistration();

  const {
    data: areasResponse,
    isLoading: isLoadingAreas,
    isError: areasError,
    refetch: refetchAreas,
  } = useQuery({
    queryKey: ["areas"],
    queryFn: getAreas,
    staleTime: 5 * 60 * 1000,
  });

  const areas = areasResponse?.data ?? [];

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

  const isSubmitting = registerMutation.isPending;

  return (
    <div className="space-y-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
        className="space-y-5"
      >
        {/* Full name */}
        <form.Field name="name">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Full name</Label>
              <Input
                id={field.name}
                name={field.name}
                autoComplete="name"
                placeholder="Enter your full name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={isSubmitting}
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
                autoComplete="email"
                placeholder="you@example.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={isSubmitting}
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
                autoComplete="tel"
                placeholder="01XXXXXXXXX"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={isSubmitting}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Area dropdown */}
        <form.Field name="areaId">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Your area</Label>

              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={
                  isSubmitting ||
                  isLoadingAreas ||
                  areasError ||
                  areas.length === 0
                }
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {isLoadingAreas
                    ? "Loading areas..."
                    : areasError
                      ? "Could not load areas"
                      : areas.length === 0
                        ? "No areas available"
                        : "Choose your area"}
                </option>

                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name} ({area.code})
                  </option>
                ))}
              </select>

              {areasError && (
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-destructive">
                    Failed to load available areas.
                  </p>
                  <button
                    type="button"
                    onClick={() => void refetchAreas()}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Retry
                  </button>
                </div>
              )}

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
                autoComplete="new-password"
                placeholder="Create a strong password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                disabled={isSubmitting}
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
          disabled={
            isSubmitting || isLoadingAreas || areasError || areas.length === 0
          }
        >
          {isSubmitting ? "Creating account..." : "Create account"}
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
