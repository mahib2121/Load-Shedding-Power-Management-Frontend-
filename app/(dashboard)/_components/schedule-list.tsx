"use client";

import { AlertTriangle, Inbox, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ScheduleCard } from "./schedule-card";

import type { LoadSheddingSchedule } from "@/app/(dashboard)/_features/schedules/schedule.types";

type ScheduleListProps = {
  schedules?: LoadSheddingSchedule[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function ScheduleList({
  schedules,
  isLoading,
  isError,
  onRetry,
  emptyTitle = "No schedules found",
  emptyDescription = "There are no load shedding schedules available.",
}: ScheduleListProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/20 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Loading schedules…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-5" />
        </div>
        <div>
          <p className="font-semibold text-destructive">
            Failed to load schedules
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={() => onRetry()}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (!schedules?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Inbox className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold">{emptyTitle}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {schedules.map((schedule) => (
        <ScheduleCard key={schedule.id} schedule={schedule} />
      ))}
    </div>
  );
}
