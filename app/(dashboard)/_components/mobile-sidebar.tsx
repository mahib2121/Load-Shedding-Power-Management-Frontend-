"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X, Zap, LogOut, UserRound, Settings } from "lucide-react";

import { DashboardNav } from "./dashboard-nav";
import { useAuth } from "@/app/(auth)/_features/auth.provider";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ROLE_LABEL: Record<string, string> = {
  CUSTOMER: "Customer",
  FIELD_OPERATOR: "Field Operator",
  ZONE_MANAGER: "Zone Manager",
  SUPER_ADMIN: "Super Admin",
};

type MobileSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const { user, logout } = useAuth();

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "U";

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={() => onOpenChange(false)}
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        tabIndex={open ? 0 : -1}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          "absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col border-r bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <Link
            href="/dashboard"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2.5 font-semibold"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
              <Zap className="size-4" fill="currentColor" />
            </div>
            <span className="text-sm">Power Management</span>
          </Link>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close menu"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <DashboardNav />
        </div>

        {/* Footer user card */}
        {user && (
          <div className="shrink-0 space-y-2 border-t p-3">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
                <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <ButtonLink
                href="/dashboard/profile"
                variant="outline"
                size="sm"
                className="h-9 w-full"
                onClick={() => onOpenChange(false)}
              >
                <UserRound className="mr-1.5 size-3.5" />
                Profile
              </ButtonLink>
              <ButtonLink
                href="/dashboard/settings"
                variant="outline"
                size="sm"
                className="h-9 w-full"
                onClick={() => onOpenChange(false)}
              >
                <Settings className="mr-1.5 size-3.5" />
                Settings
              </ButtonLink>
            </div>

            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                void logout();
              }}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full border border-destructive/30 bg-destructive/5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="size-3.5" />
              Logout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
