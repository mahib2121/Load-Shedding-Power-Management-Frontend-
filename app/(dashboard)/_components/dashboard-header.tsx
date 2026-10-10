"use client";

import Link from "next/link";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useAuth } from "@/app/(auth)/_features/auth.provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { useDashboardShell } from "../dashboard/layout";

const ROLE_LABEL: Record<string, string> = {
  CUSTOMER: "Customer",
  FIELD_OPERATOR: "Field Operator",
  ZONE_MANAGER: "Zone Manager",
  SUPER_ADMIN: "Super Admin",
};

type DashboardHeaderProps = {
  onOpenMobileNav: () => void;
};

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Overview", subtitle: "Your power at a glance" },
  "/dashboard/schedules": {
    title: "Load Shedding Schedules",
    subtitle: "Plan your week with confidence",
  },
  "/dashboard/outages": {
    title: "Outages",
    subtitle: "Live outage tracking and history",
  },
  "/dashboard/payments": {
    title: "Payments",
    subtitle: "Bills, invoices, and history",
  },
  "/dashboard/profile": {
    title: "Profile",
    subtitle: "Manage your account",
  },
  "/dashboard/assignments": {
    title: "Assignments",
    subtitle: "Your assigned tasks",
  },
  "/dashboard/team": {
    title: "Team",
    subtitle: "Members in your zone",
  },
  "/dashboard/users": {
    title: "Users",
    subtitle: "Manage platform users",
  },
  "/dashboard/zones": {
    title: "Zones",
    subtitle: "Coverage and configuration",
  },
  "/dashboard/settings": {
    title: "Settings",
    subtitle: "Platform configuration",
  },
};

export function DashboardHeader({ onOpenMobileNav }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { setMobileNavOpen } = useDashboardShell();

  const meta =
    PAGE_TITLES[pathname] ??
    (pathname.startsWith("/dashboard/schedules/")
      ? { title: "Schedule Detail", subtitle: "Slots and approvals" }
      : pathname.startsWith("/dashboard/outages/")
        ? { title: "Outage Detail", subtitle: "Report and timeline" }
        : { title: "Dashboard", subtitle: "Power management" });

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "U";

  const handleOpenNav = () => {
    setMobileNavOpen(true);
    onOpenMobileNav();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-xl md:px-6">
      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open navigation"
        onClick={handleOpenNav}
      >
        <Menu className="size-5" />
      </Button>

      {/* Page title (desktop) */}
      <div className="hidden min-w-0 flex-1 md:block">
        <h1 className="truncate text-base font-semibold leading-tight">
          {meta.title}
        </h1>
        <p className="truncate text-xs text-muted-foreground">
          {meta.subtitle}
        </p>
      </div>

      {/* Mobile greeting */}
      <div className="min-w-0 flex-1 md:hidden">
        <p className="truncate text-sm font-semibold">
          {meta.title}
        </p>
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          aria-label="Search"
          placeholder="Search schedules, outages..."
          className="h-9 w-56 rounded-full border bg-muted/30 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 lg:w-72"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none items-center rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
          ⌘K
        </kbd>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Search"
          className="md:hidden"
        >
          <Search className="size-4" />
        </Button>

        <ThemeToggle />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 inline-flex size-2 rounded-full bg-destructive ring-2 ring-background" />
        </Button>

        {/* User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="User menu"
                  className="ml-1 inline-flex items-center gap-2 rounded-full p-1 pr-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {initials}
                  </span>
                  <span className="hidden text-left leading-tight sm:block">
                    <span className="block text-xs font-semibold">
                      {user.name}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      {ROLE_LABEL[user.role] ?? user.role}
                    </span>
                  </span>
                  <ChevronDown className="hidden size-3.5 text-muted-foreground sm:inline" />
                </button>
              }
            />

            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="space-y-1">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                  <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {ROLE_LABEL[user.role] ?? user.role}
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
                <UserRound className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                <Settings className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => void logout()}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
