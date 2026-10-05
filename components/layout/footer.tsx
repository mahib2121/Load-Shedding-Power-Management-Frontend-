import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="size-4" />
              </div>

              <span>Power Management</span>
            </Link>

            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Load shedding and power management information for a smarter and
              more reliable power experience.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold">Quick Links</h3>

            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>

              <Link
                href="/load-shedding"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Load Shedding
              </Link>

              <Link
                href="/outages"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Outages
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold">Account</h3>

            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Register
              </Link>

              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Power Management. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
