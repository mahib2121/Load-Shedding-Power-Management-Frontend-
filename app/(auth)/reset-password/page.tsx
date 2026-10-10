import { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
          <p className="text-sm text-muted-foreground">
            Loading password reset form...
          </p>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
