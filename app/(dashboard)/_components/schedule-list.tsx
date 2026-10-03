"use client";

import { Loader2 } from "lucide-react";

import { ScheduleCard } from "./schedule-card";

import type { LoadSheddingSchedule } from "@/app/(dashboard)/_features/schedules/schedule.types";

type ScheduleListProps = {
  schedules?: LoadSheddingSchedule[];
  isLoading: boolean;
  isError: boolean;
};

export function ScheduleList({
  schedules,
  isLoading,
  isError,
}: ScheduleListProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="font-medium">Failed to load schedules</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  if (!schedules?.length) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="font-medium">No schedules found</p>

        <p className="mt-1 text-sm text-muted-foreground">
          There are no load shedding schedules available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {schedules.map((schedule) => (
        <ScheduleCard key={schedule.id} schedule={schedule} />
      ))}
    </div>
  );
}
