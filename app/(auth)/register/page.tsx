import type { Metadata } from "next";

import { RegisterForm } from "@/components/form/register-form";

export const metadata: Metadata = {
  title: "Create Account | Power Management",
  description: "Create your Power Management account",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Create an account
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Register to access Load Shedding & Power Management
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
