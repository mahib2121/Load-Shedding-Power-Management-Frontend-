"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { loginSchema } from "@/app/(auth)/_features/auth.schima";
import { useLogin } from "@/app/(auth)/_features/auth.hook";

export default function LoginForm() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    validators: {
      onSubmit: loginSchema,
    },

    onSubmit: async ({ value }) => {
      login(value, {
        onSuccess: (response) => {
          toast.success(response.message || "Login successful");

          router.push("/dashboard");
          router.refresh();
        },

        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Invalid email or password",
          );
        },
      });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>

        <p className="text-sm text-muted-foreground">
          Sign in to your Load Shedding account
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="email">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  disabled={isPending}
                />

                {field.state.meta.errors.length > 0 && (
                  <FieldError>
                    {field.state.meta.errors.map((error) => (
                      <div key={error?.message}>{error?.message}</div>
                    ))}
                  </FieldError>
                )}
              </Field>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="pr-10"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    disabled={isPending}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={isPending}
                  >
                    {showPassword ? (
                      <EyeClosed className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                {field.state.meta.errors.length > 0 && (
                  <FieldError>
                    {field.state.meta.errors.map((error) => (
                      <div key={error?.message}>{error?.message}</div>
                    ))}
                  </FieldError>
                )}
              </Field>
            )}
          </form.Field>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Dont have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Create an account
            </Link>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
