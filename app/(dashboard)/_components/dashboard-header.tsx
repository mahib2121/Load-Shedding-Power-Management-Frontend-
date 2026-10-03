"use client";

import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/app/(auth)/_features/auth.provider";

export function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </Button>

        <div>
          <p className="text-sm font-medium md:text-base">
            Welcome back, {user?.name?.split(" ")[0] ?? "User"}
          </p>

          <p className="hidden text-xs text-muted-foreground sm:block">
            Load Shedding & Power Management
          </p>
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
        <LogOut className="size-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </header>
  );
}
