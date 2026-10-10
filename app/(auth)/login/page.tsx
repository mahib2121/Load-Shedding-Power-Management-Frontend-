import Link from "next/link";

import GoogleSignInButton from "@/components/form/google-login-button";
import LoginForm from "@/components/form/login-form";
import GoogleAuthProvider from "@/providers/googelAuth";

export default function LoginPage() {
  return (
    <GoogleAuthProvider>
      <div className="grid min-h-svh bg-background lg:grid-cols-2">
        {/* Login section */}
        <div className="relative flex min-h-svh flex-col px-6 py-8 sm:px-10 lg:px-16">
          {/* Brand */}
          <Link
            href="/"
            className="flex w-fit items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-xl text-primary-foreground shadow-sm">
              ⚡
            </span>
            <span className="text-lg font-bold tracking-tight">
              Load Shedding
            </span>
          </Link>

          {/* Form */}
          <div className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-sm space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back
                </h1>
                <p className="text-sm leading-6 text-muted-foreground">
                  Sign in to manage your account and stay updated on power
                  schedules.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                <div className="space-y-5">
                  <LoginForm />

                  <div className="relative flex items-center">
                    <div className="flex-1 border-t" />
                    <span className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Or continue with
                    </span>
                    <div className="flex-1 border-t" />
                  </div>

                  <div className="flex justify-center">
                    <GoogleSignInButton />
                  </div>

                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link
                  href="/terms"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground lg:text-left">
            © {new Date().getFullYear()} Load Shedding. All rights reserved.
          </p>
        </div>

        {/* Desktop visual panel */}
        <div className="relative hidden overflow-hidden bg-muted lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background/30 to-primary/5" />

          <div className="absolute -right-24 -top-24 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative z-10 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="size-2 rounded-full bg-primary" />
            Smarter power management
          </div>

          <div className="relative z-10 max-w-lg space-y-6">
            <div className="flex size-16 items-center justify-center rounded-2xl border bg-background/80 text-3xl shadow-sm backdrop-blur">
              ⚡
            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Stay informed.
              <br />
              Power your day.
            </h2>

            <p className="max-w-md text-base leading-7 text-muted-foreground">
              Access load-shedding schedules, track power outages, and get the
              information you need to plan your day with confidence.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="rounded-xl border bg-background/70 p-4 backdrop-blur">
                <p className="text-sm font-semibold">Live updates</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Keep track of power status.
                </p>
              </div>

              <div className="rounded-xl border bg-background/70 p-4 backdrop-blur">
                <p className="text-sm font-semibold">Schedule access</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Plan around scheduled outages.
                </p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs text-muted-foreground">
            Reliable information for better power planning.
          </p>
        </div>
      </div>
    </GoogleAuthProvider>
  );
}
