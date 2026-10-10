"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { resetPassword } from "@/app/(auth)/_features/auth.api";
import { resetPasswordSchema } from "@/app/(auth)/_features/auth.schima";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(() => searchParams.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);

    const result = resetPasswordSchema.safeParse({
      email: email.trim(),
      otp: otp.trim(),
      newPassword,
    });

    if (!result.success) {
      setErrors(result.error.issues.map((issue) => issue.message));
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword(result.data);
      toast.success(response.message || "Password changed successfully.");
      router.replace("/login");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to reset your password. Check the code and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to login
        </Link>

        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <KeyRound className="size-6" />
          </div>

          <div className="mb-6 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Reset your password
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Enter the reset code you received and choose a new password for
              your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={isLoading}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-60"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium">
                6-digit reset code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                required
                disabled={isLoading}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm tracking-[0.25em] outline-none transition-colors placeholder:text-muted-foreground placeholder:tracking-normal focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-60"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                New password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                disabled={isLoading}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-60"
              />
              <p className="text-xs leading-5 text-muted-foreground">
                Use at least 8 characters and follow your account&apos;s
                password requirements.
              </p>
            </div>

            {errors.length > 0 && (
              <ul className="space-y-1 text-sm text-destructive" role="alert">
                {errors.map((error, index) => (
                  <li key={`${error}-${index}`}>{error}</li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Updating password..." : "Reset password"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Need another reset code?{" "}
            <Link
              href="/forgot-password"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Request a new one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
