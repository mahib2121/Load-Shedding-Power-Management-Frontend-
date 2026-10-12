import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Dashboard loading skeleton.
 *
 * Rendered automatically by Next.js while the dashboard segment is being
 * prepared. Mirrors the structure of the dashboard page (title, status
 * banner, KPIs, schedule timeline, quick actions, account info) so the
 * transition into the real content is smooth and feels intentional.
 */
export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading dashboard"
      className="space-y-6"
    >
      <span className="sr-only">Loading dashboard…</span>

      {/* Hero / greeting card */}
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div
          aria-hidden
          className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/15 blur-3xl"
        />
        <CardContent className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="space-y-3">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80 max-w-full" />
            <div className="flex flex-wrap gap-2 pt-1">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
            <Skeleton className="h-10 w-40 rounded-full" />
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* Status banner */}
      <Skeleton className="h-12 w-full rounded-xl" />

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </div>

      {/* Two-column section: schedule timeline + side panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Schedule / timeline card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-3.5 w-56" />
              </div>
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <ScheduleTimelineSkeleton />
            <Skeleton className="h-20 w-full rounded-xl" />
          </CardContent>
        </Card>

        {/* Quick actions + system health */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3.5 w-44" />
              </div>
            </CardHeader>
            <CardContent className="grid gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border bg-background p-3"
                >
                  <Skeleton className="size-9 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="size-3.5 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-3.5 w-20" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-7 rounded-md" />
                    <Skeleton className="h-3.5 w-20" />
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Account information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle>
                <span className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Skeleton className="size-3.5 rounded-sm" />
                  </span>
                  <Skeleton className="h-5 w-44" />
                </span>
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-3.5 w-56" />
              </CardDescription>
            </div>
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border bg-muted/20 p-3.5"
              >
                <Skeleton className="mb-2 h-3 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Helpers ---------- */

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-md bg-muted/60 ${className ?? ""}`}
    />
  );
}

function KpiSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 animate-pulse bg-muted"
      />
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="size-9 rounded-lg" />
        </div>
        <Skeleton className="mt-4 h-8 w-16" />
        <Skeleton className="mt-2 h-3 w-28" />
      </CardContent>
    </Card>
  );
}

function ScheduleTimelineSkeleton() {
  return (
    <ol className="relative space-y-3 border-l-2 border-dashed border-muted pl-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="relative">
          <span
            aria-hidden
            className="absolute -left-[27px] top-1.5 size-4 animate-pulse rounded-full border-2 border-background bg-muted"
          />
          <div className="flex flex-col gap-2 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="space-y-1.5 sm:text-right">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
