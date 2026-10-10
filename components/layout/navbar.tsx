"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User,
  Menu,
  X,
  Search,
  Zap,
  Calendar,
  Map,
  CreditCard,
  Users,
  HelpCircle,
  BookOpen,
  Phone,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";

import { useAuth } from "@/app/(auth)/_features/auth.provider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/load-shedding", label: "Schedules" },
  { href: "/outages", label: "Outages" },
  { href: "/zones", label: "Zones" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const QUICK_LINKS = [
  { href: "/dashboard/schedules", label: "My Schedule", icon: Calendar },
  { href: "/dashboard/outages", label: "Live Outages", icon: Zap },
  { href: "/dashboard/zones", label: "Zone Map", icon: Map },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/team", label: "Team", icon: Users },
] as const;

export function Navbar() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      {/* Top utility bar */}
      <div className="hidden border-b bg-muted/40 md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs text-muted-foreground md:px-6">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              All systems operational
            </span>
            <span className="text-border">|</span>
            <span>Updated 2 min ago</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/help"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <HelpCircle className="size-3" />
              Help Center
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <BookOpen className="size-3" />
              Docs
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <Phone className="size-3" />
              24/7 Support
            </Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold"
          aria-label="Power Management home"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
            <Zap className="size-5" fill="currentColor" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="hidden text-base sm:inline">Power Management</span>
            <span className="hidden text-[10px] font-normal text-muted-foreground sm:inline">
              Load Shedding &amp; Outage Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search (desktop) */}
          <button
            type="button"
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline-flex"
          >
            <Search className="size-4" />
          </button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications (authenticated) */}
          {isAuthenticated && (
            <button
              type="button"
              aria-label="Notifications"
              className="relative hidden h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline-flex"
            >
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 inline-flex size-2 rounded-full bg-destructive ring-2 ring-background" />
            </button>
          )}

          {/* User actions / CTA */}
          {!isLoading && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        type="button"
                        aria-label="User menu"
                        className="inline-flex items-center gap-2 rounded-full p-1 pr-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </span>

                        <span className="hidden max-w-32 truncate sm:inline">
                          {user.name}
                        </span>

                        <ChevronDown className="size-4" />
                      </button>
                    }
                  />

                  <DropdownMenuContent align="end" className="w-64">
                    {/* User information */}
                    <div className="px-3 py-2.5">
                      <p className="truncate text-sm font-semibold">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="mt-1.5 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {user.role.replace("_", " ")}
                      </p>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Quick links */}
                    <div className="px-1 py-1">
                      <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Quick Access
                      </p>
                      {QUICK_LINKS.map((q) => (
                        <DropdownMenuItem
                          key={q.href}
                          render={<Link href={q.href} />}
                          className="cursor-pointer"
                        >
                          <q.icon className="mr-2 size-4 text-muted-foreground" />
                          {q.label}
                        </DropdownMenuItem>
                      ))}
                    </div>

                    <DropdownMenuSeparator />

                    {/* Dashboard */}
                    <DropdownMenuItem render={<Link href="/dashboard" />}>
                      <LayoutDashboard className="mr-2 size-4" />
                      Dashboard
                    </DropdownMenuItem>

                    {/* Profile */}
                    <DropdownMenuItem
                      render={<Link href="/dashboard/profile" />}
                    >
                      <User className="mr-2 size-4" />
                      Profile
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Logout */}
                    <DropdownMenuItem
                      onClick={() => void logout()}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 size-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden h-9 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-flex"
                  >
                    Login
                  </Link>

                  <ButtonLink
                    href="/register"
                    size="sm"
                    className="h-9 rounded-full px-4 text-sm"
                  >
                    Get Started
                  </ButtonLink>
                </>
              )}
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="border-t bg-background lg:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4"
            aria-label="Mobile"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 border-t" />

            {isAuthenticated ? (
              <>
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick Access
                </p>
                {QUICK_LINKS.map((q) => (
                  <Link
                    key={q.href}
                    href={q.href}
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <q.icon className="size-4" />
                    {q.label}
                  </Link>
                ))}
                <div className="my-2 border-t" />
                <Button
                  variant="destructive"
                  onClick={() => {
                    setMobileOpen(false);
                    void logout();
                  }}
                  className="justify-start"
                >
                  <LogOut className="mr-2 size-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <ButtonLink
                  href="/login"
                  variant="outline"
                  className="w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </ButtonLink>
                <ButtonLink
                  href="/register"
                  className="w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </ButtonLink>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
