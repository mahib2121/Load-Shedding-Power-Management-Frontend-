"use client";

import { CalendarDays, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/app/(auth)/_features/auth.provider";
import {
  useMySchedule,
  useSchedules,
} from "../../_features/schedules/schedule.hook";
import { ScheduleList } from "../../_components/schedule-list";

export default function SchedulesPage() {
  const { user } = useAuth();

  const isCustomer = user?.role === "CUSTOMER";

  const managerQuery = useSchedules();
  const customerQuery = useMySchedule();

  const query = isCustomer ? customerQuery : managerQuery;

  const schedules = query.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-6" />

            <h1 className="text-2xl font-bold tracking-tight">
              Load Shedding Schedules
            </h1>
          </div>

          <p className="mt-1 text-muted-foreground">
            View and manage load shedding schedules for your area.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => query.refetch()}
          disabled={query.isFetching}
        >
          <RefreshCw
            className={`mr-2 size-4 ${query.isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <ScheduleList
        schedules={schedules}
        isLoading={query.isLoading}
        isError={query.isError}
      />
    </div>
  );
}
