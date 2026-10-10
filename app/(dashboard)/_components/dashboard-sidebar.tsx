"use client";

import Link from "next/link";
import { Zap, ChevronRight, LogOut, Settings, UserRound } from "lucide-react";

import { DashboardNav } from "./dashboard-nav";
import { useAuth } from "@/app/(auth)/_features/auth.provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROLE_LABEL: Record<string, string> = {
  CUSTOMER: "Customer",
  FIELD_OPERATOR: "Field Operator",
  ZONE_MANAGER: "Zone Manager",
  SUPER_ADMIN: "Super Admin",
};

const ROLE_TINT: Record<string, string> = {
  CUSTOMER: "from-sky-500/15 to-sky-500/0 text-sky-700 dark:text-sky-300",
  FIELD_OPERATOR:
    "from-amber-500/15 to-amber-500/0 text-amber-700 dark:text-amber-300",
  ZONE_MANAGER:
    "from-violet-500/15 to-violet-500/0 text-violet-700 dark:text-violet-300",
  SUPER_ADMIN:
    "from-rose-500/15 to-rose-500/0 text-rose-700 dark:text-rose-300",
};

export function DashboardSidebar() {
  const { user, logout } = useAuth();

  const role = user?.role ?? "CUSTOMER";
  const roleLabel = ROLE_LABEL[role] ?? role;
  const roleTint = ROLE_TINT[role] ?? ROLE_TINT.CUSTOMER;
  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "U";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 shrink-0 flex-col border-r bg-background/80 backdrop-blur-xl md:flex">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b px-5">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2.5 font-semibold"
        >
          <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
            <Zap className="size-4" fill="currentColor" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm">Power Management</span>
            <span className="text-[10px] font-normal text-muted-foreground">
              {roleLabel} workspace
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <DashboardNav />
      </div>

      {/* User card */}
      {user && (
        <div className="shrink-0 border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="User menu"
                  className="group flex w-full items-center gap-3 rounded-xl border bg-gradient-to-br p-2.5 text-left transition-all hover:border-primary/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-tight">
                      {user.name}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[popup-open]:rotate-90" />
                </button>
              }
            />

            <DropdownMenuContent align="end" side="right" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1.5">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                  <span
                    className={`mt-1 inline-flex w-fit items-center rounded-full bg-gradient-to-r ${roleTint} px-2 py-0.5 text-[10px] font-medium`}
                  >
                    {roleLabel}
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
                <UserRound className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>

              {(role === "SUPER_ADMIN" || role === "ZONE_MANAGER") && (
                <DropdownMenuItem
                  render={<Link href="/dashboard/settings" />}
                >
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
              )}

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
        </div>
      )}
    </aside>
  );
}
