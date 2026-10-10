"use client";

import { useAuth } from "@/app/(auth)/_features/auth.provider";

import { CustomerScheduleView } from "./_views/customer-schedule-view";
import { ManagerSchedulesView } from "./_views/manager-schedules-view";

export default function SchedulesPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  switch (user?.role) {
    case "CUSTOMER":
      return <CustomerScheduleView />;

    case "ZONE_MANAGER":
    case "SUPER_ADMIN":
      return <ManagerSchedulesView />;

    default:
      return (
        <div className="rounded-lg border p-6">
          <h1 className="font-semibold">Schedules unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account does not have access to load-shedding schedules.
          </p>
        </div>
      );
  }
}
