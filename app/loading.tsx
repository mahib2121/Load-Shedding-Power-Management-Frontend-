/**
 * Root loading skeleton.
 *
 * Renders inside the public SiteShell (Navbar + Footer) while a page
 * outside the dedicated dashboard loading boundary is being prepared.
 * Kept intentionally minimal — it covers both the marketing surface
 * (the public landing) and the auth pages.
 */
export default function RootLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-16"
    >
      <span className="sr-only">Loading…</span>

      {/* Hero / page title skeleton */}
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <div className="mx-auto h-3 w-40 animate-pulse rounded-full bg-muted" />
        <div className="mx-auto h-10 w-3/4 animate-pulse rounded-md bg-muted" />
        <div className="mx-auto h-4 w-2/3 animate-pulse rounded-md bg-muted" />
        <div className="mx-auto flex w-full max-w-sm gap-3 pt-4">
          <div className="h-11 flex-1 animate-pulse rounded-full bg-muted" />
          <div className="h-11 flex-1 animate-pulse rounded-full bg-muted" />
        </div>
      </div>

      {/* Section skeleton */}
      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-2xl border bg-card p-6 shadow-md"
          >
            <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
            <div className="space-y-1.5">
              <div className="h-3 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-5/6 animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
