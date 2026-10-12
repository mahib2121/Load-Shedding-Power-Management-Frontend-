"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Home, Search, Zap } from "lucide-react";

import { Button, ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Top-level 404 page.
 *
 * Renders inside the public SiteShell (Navbar + Footer) so it stays
 * consistent with the rest of the marketing surfaces. The primary
 * "Go to Home" link targets the public landing route `/`, which is the
 * appropriate entry point for unauthenticated visitors.
 */
export default function NotFound() {
  const router = useRouter();

  // Update the document title so the browser tab reflects the 404.
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Page not found · Load Shedding & Power Management";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  return (
    <section
      role="alert"
      aria-live="polite"
      className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden py-16"
    >
      {/* Decorative grid background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_4%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_4%,transparent)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 -z-10 h-96 w-[44rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 right-0 -z-10 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl"
      />

      <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
        <Card className="relative overflow-hidden border-2 shadow-xl">
          {/* Top accent bar */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500/40 via-primary to-amber-500/40"
          />

          <CardHeader className="items-center text-center pt-10">
            {/* Lightning bolt visual */}
            <div className="relative mx-auto">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 mx-auto size-32 rounded-full bg-gradient-to-tr from-amber-500/30 via-primary/30 to-primary/10 blur-2xl"
              />
              <div className="relative flex size-24 items-center justify-center rounded-full border-2 bg-gradient-to-br from-primary/15 via-background to-amber-500/10 text-primary shadow-inner sm:size-28">
                <Zap
                  className="size-12 drop-shadow-[0_0_18px_rgba(99,102,241,0.45)] sm:size-14"
                  fill="currentColor"
                  aria-hidden
                />
                <span className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full border-2 border-background bg-amber-500 text-amber-950 shadow-sm sm:size-8">
                  <AlertTriangle className="size-3.5 sm:size-4" />
                </span>
              </div>
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Error 404
            </p>
            <CardTitle className="mt-2 text-7xl font-extrabold leading-none tracking-tight md:text-8xl">
              <span className="bg-gradient-to-br from-primary via-primary/70 to-amber-500 bg-clip-text text-transparent">
                404
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pb-10 text-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Oops! Page not found.
              </h1>
              <CardDescription className="mx-auto max-w-md text-base">
                The page you&apos;re looking for may have moved, been renamed,
                or no longer exists. Let&apos;s get you back on the grid.
              </CardDescription>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href="/"
                size="lg"
                className="h-11 w-full px-6 sm:w-auto"
              >
                <Home className="mr-2 size-4" />
                Go to Home
              </ButtonLink>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-11 w-full px-6 sm:w-auto"
                onClick={handleGoBack}
              >
                <ArrowLeft className="mr-2 size-4" />
                Go Back
              </Button>
            </div>

            {/* Helpful quick links */}
            <div className="mx-auto mt-8 grid max-w-lg gap-2 sm:grid-cols-2">
              <QuickLink
                href="/dashboard"
                title="Dashboard"
                description="View your power status"
              />
              <QuickLink
                href="/dashboard/schedules"
                title="Schedules"
                description="Browse load shedding"
              />
              <QuickLink
                href="/dashboard/outages"
                title="Live Outages"
                description="Track incidents in real time"
              />
              <QuickLink
                href="/login"
                title="Sign in"
                description="Access your account"
              />
            </div>

            <p className="pt-4 text-xs text-muted-foreground">
              Still stuck? Try searching from the navigation bar above, or head
              back to the home page.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/* ---------- Components ---------- */

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <ButtonLink
      href={href}
      variant="ghost"
      className="h-auto w-full justify-start gap-3 rounded-xl border bg-background/60 px-3 py-2.5 text-left hover:bg-muted"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Search className="size-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {description}
        </span>
      </span>
    </ButtonLink>
  );
}
