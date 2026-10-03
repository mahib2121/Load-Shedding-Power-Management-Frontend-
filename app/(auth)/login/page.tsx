import Link from "next/link";

import LoginForm from "@/components/form/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">Load Shedding</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="relative hidden bg-muted lg:block">
        {/* <img
          src="/login.jpg"
          alt="Power grid"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.25] dark:grayscale"
        /> */}
      </div>
    </div>
  );
}
