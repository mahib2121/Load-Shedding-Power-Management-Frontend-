"use client";

import Link from "next/link";

import { Zap } from "lucide-react";

import { DashboardNav } from "./dashboard-nav";
import { useAuth } from "@/app/(auth)/_features/auth.provider";

export function DashboardSidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:flex md:flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </div>

          <span>Power Management</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <DashboardNav />
      </div>

      {user && (
        <div className="border-t p-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="truncate text-sm font-medium">{user.name}</p>

            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>

            <p className="mt-2 text-xs font-medium uppercase text-muted-foreground">
              {user.role.replaceAll("_", " ")}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
