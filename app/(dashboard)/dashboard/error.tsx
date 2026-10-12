"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  LayoutDashboard,
  RefreshCcw,
  Zap,
} from "lucide-react";

import { Button, ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/app/(auth)/_features/auth.provider";
import { ApiError } from "@/lib/api/errors";

/**
 * Dashboard error boundary (App Router).
 *
 * Catches uncaught errors thrown by any client component rendered under
 * `app/(dashboard)/dashboard/`. Designed to be a client component per
 * Next.js requirements: receives the error + a `reset()` callback that
 * re-renders the failed segment.
 *
 * Safety: we never render the raw error message, stack trace, or any
 * metadata that could include tokens, cookies, or sensitive server
 * details. A short, random reference id is generated for support
 * correlation, and the full error is forwarded to the project's
 * existing logging surface (`console.error`).
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Stable reference id so the user can quote it when reporting the issue.
  const referenceId = useMemo(() => generateReferenceId(), []);

  // Log the full error to the browser console. The dashboard's
  // existing ApiError type is preserved so consumers (e.g. Sentry, or
  // a future logger) can pick it up without further wiring.
  useEffect(() => {
    console.error("[DashboardError]", {
      referenceId,
      name: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      statusCode: error instanceof ApiError ? error.statusCode : undefined,
    });
  }, [error, referenceId]);

  const isApiError = error instanceof ApiError;
  const safeMessage = pickSafeMessage(error);

  return (
    <section
      role="alert"
      aria-live="assertive"
      className="relative flex min-h-[60vh] items-center justify-center py-10"
    >
      {/* Soft background gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--destructive)_8%,transparent),transparent_60%)]"
      />

      <div className="mx-auto w-full max-w-2xl px-4 md:px-6">
        <Card className="relative overflow-hidden border-2 border-destructive/20 shadow-xl">
          {/* Top accent bar */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-destructive/40 via-destructive to-amber-500/60"
          />

          <CardHeader className="items-center text-center pt-10">
            <div className="relative mx-auto">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 mx-auto size-28 rounded-full bg-destructive/15 blur-2xl"
              />
              <div className="relative flex size-20 items-center justify-center rounded-full border-2 border-destructive/30 bg-gradient-to-br from-destructive/10 via-background to-amber-500/10 text-destructive shadow-inner sm:size-24">
                <Zap
                  className="size-10 text-destructive/80 sm:size-12"
                  fill="currentColor"
                  aria-hidden
                />
                <span className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-background bg-destructive text-destructive-foreground shadow-sm sm:size-9">
                  <AlertTriangle className="size-4 sm:size-5" />
                </span>
              </div>
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-destructive">
              Dashboard Error
            </p>
            <CardTitle className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Something went wrong.
            </CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-md text-base">
              An unexpected error occurred while loading the dashboard.
              We&apos;ve logged the details — please try again in a moment.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pb-10">
            {/* Status / details panel (safe only) */}
            <div className="mx-auto w-full max-w-md rounded-xl border bg-muted/30 p-4 text-left">
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Reference</dt>
                  <dd className="font-mono text-xs font-medium tracking-wide">
                    {referenceId}
                  </dd>
                </div>
                {error.digest && (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Server digest</dt>
                    <dd className="truncate font-mono text-xs font-medium tracking-wide">
                      {error.digest}
                    </dd>
                  </div>
                )}
                {isApiError && (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="font-mono text-xs font-medium tracking-wide">
                      {error.statusCode}
                    </dd>
                  </div>
                )}
                {safeMessage && (
                  <div className="flex items-start justify-between gap-3 border-t pt-2">
                    <dt className="shrink-0 text-muted-foreground">Reason</dt>
                    <dd className="text-right text-xs font-medium">
                      {safeMessage}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                size="lg"
                className="h-11 w-full px-6 sm:w-auto"
                onClick={() => reset()}
              >
                <RefreshCcw className="mr-2 size-4" />
                Try Again
              </Button>

              {isAuthenticated ? (
                <ButtonLink
                  href="/dashboard"
                  variant="outline"
                  size="lg"
                  className="h-11 w-full px-6 sm:w-auto"
                >
                  <LayoutDashboard className="mr-2 size-4" />
                  Back to Dashboard
                </ButtonLink>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-11 w-full px-6 sm:w-auto"
                  onClick={() => router.push("/login")}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Back to Sign in
                </Button>
              )}
            </div>

            <p className="pt-2 text-center text-xs text-muted-foreground">
              If the problem persists, please contact support and share the
              reference id above.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/* ---------- Helpers ---------- */

/**
 * Generate a short, human-readable reference id we can show in the UI
 * and use for log correlation. Not cryptographically secure — it's a
 * support identifier, not an auth token.
 */
function generateReferenceId(): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().split("-")[0]
      : Math.random().toString(36).slice(2, 8);
  const ts = Date.now().toString(36).toUpperCase().slice(-4);
  return `LSMS-${ts}-${rand.toUpperCase()}`;
}

/**
 * Return a short, "safe" message we can show in the UI.
 *
 * We deliberately avoid raw `error.message` because it can include
 * server-side details, query params, or stack-influenced strings.
 * Only include a sanitized message when:
 *   - the error is an `ApiError` with a status code (in which case the
 *     message is server-provided but at least typed), OR
 *   - the message is short and contains no obvious secrets/paths.
 */
function pickSafeMessage(error: Error & { digest?: string }): string | null {
  const fallback = "An unexpected error occurred.";

  if (error instanceof ApiError) {
    const status = error.statusCode;
    if (status >= 500) return "The server is having trouble right now.";
    if (status === 401) return "You need to sign in to continue.";
    if (status === 403) return "You don't have access to this dashboard.";
    if (status === 404) return "The requested data could not be found.";
    if (status === 408 || status === 504) return "The request timed out.";
    if (status === 429) return "Too many requests. Please slow down.";
    if (status >= 400) return "We couldn't complete that request.";
  }

  if (typeof error.message === "string") {
    const message = error.message.trim();
    // Only surface very short, non-sensitive messages.
    if (
      message.length > 0 &&
      message.length <= 80 &&
      !looksSensitive(message)
    ) {
      return message;
    }
  }

  return fallback;
}

const SENSITIVE_KEYWORDS = [
  "token",
  "secret",
  "password",
  "apikey",
  "api_key",
  "authorization",
  "bearer",
  "cookie",
  "session",
  "private",
  "stack",
  "/users/",
  "/api/",
  "sql",
  "database",
  "prisma",
  "internal",
];

function looksSensitive(message: string): boolean {
  const lower = message.toLowerCase();
  return SENSITIVE_KEYWORDS.some((kw) => lower.includes(kw));
}
