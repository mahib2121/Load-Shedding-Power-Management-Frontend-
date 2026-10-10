"use client";

import {
  AlertCircle,
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  RefreshCw,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useMySchedule } from "@/app/(dashboard)/_features/schedules/schedule.hook";

function formatDate(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
  }).format(date);
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function CustomerScheduleView() {
  const query = useMySchedule();

  const schedules = query.data ?? [];

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (query.isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <AlertCircle className="size-8 text-destructive" />

          <h2 className="font-semibold">Could not load your schedule</h2>

          <p className="max-w-md text-sm text-muted-foreground">
            We could not retrieve the active load-shedding schedule for your
            area. Please try again in a moment.
          </p>

          <Button onClick={() => query.refetch()} disabled={query.isFetching}>
            <RefreshCw
              className={`mr-2 size-4 ${query.isFetching ? "animate-spin" : ""}`}
            />
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            Load-shedding schedule
          </div>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Your area schedule
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Active load-shedding slots planned for your assigned area.
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

      {schedules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <CalendarDays className="size-6 text-muted-foreground" />
            </div>

            <h2 className="font-semibold">No active schedule</h2>

            <p className="max-w-md text-sm text-muted-foreground">
              There is no active load-shedding schedule affecting your area
              right now. Power supply is currently uninterrupted.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Zap className="size-4" />
                      {schedule.name}
                    </CardTitle>

                    <CardDescription className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {schedule.zone?.name ?? "Zone not assigned"}
                      </span>

                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3.5" />
                        {formatDate(schedule.date)}
                      </span>
                    </CardDescription>
                  </div>

                  <span className="inline-flex shrink-0 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600">
                    Active
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                {schedule.slots && schedule.slots.length > 0 ? (
                  <div className="space-y-2">
                    {schedule.slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-medium">{slot.feeder?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {slot.feeder?.code}
                          </p>
                        </div>

                        <div className="text-sm sm:text-right">
                          <p className="font-medium">
                            <Clock3 className="mr-1 inline size-3.5 align-text-bottom" />
                            {formatTime(slot.startTime)} –{" "}
                            {formatTime(slot.endTime)}
                          </p>
                          <p className="text-muted-foreground">
                            {slot.plannedLoadReductionMW} MW reduction
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No load-shedding slots are currently scheduled for your
                    area.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          {query.isFetching && (
            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Refreshing…
            </p>
          )}
        </div>
      )}
    </div>
  );
}
