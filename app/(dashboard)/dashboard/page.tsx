"use client";

import { CalendarDays, Clock3, MapPin, UserRound, Zap } from "lucide-react";

import { useAuth } from "@/app/(auth)/_features/auth.provider";
import { useMySchedule } from "@/app/(dashboard)/_features/schedules/schedule.hook";
import type { LoadSheddingSchedule } from "@/app/(dashboard)/_features/schedules/schedule.types";

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const isCustomer = user?.role === "CUSTOMER";

  const myScheduleQuery = useMySchedule();

  if (isAuthLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null;
  }

  const schedules = myScheduleQuery.data ?? [];

  const activeSchedule = schedules.find(
    (schedule) => schedule.status === "ACTIVE",
  );

  const totalSlots = schedules.reduce(
    (total, schedule) => total + (schedule.slots?.length ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Welcome back
        </p>

        <div className="mt-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Monitor your power supply and load shedding information.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" />

            <span>{user.zone?.name ?? "Zone not assigned"}</span>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Power Status"
          value="Normal"
          description="Current power supply"
          icon={Zap}
        />

        <DashboardCard
          title="Active Schedule"
          value={activeSchedule ? "Active" : "None"}
          description={
            activeSchedule ? activeSchedule.name : "No active schedule"
          }
          icon={CalendarDays}
        />

        <DashboardCard
          title="Schedules"
          value={String(schedules.length)}
          description="Available schedules"
          icon={Clock3}
        />

        <DashboardCard
          title="Schedule Slots"
          value={String(totalSlots)}
          description="Planned load-shedding slots"
          icon={CalendarDays}
        />
      </div>

      {/* Active schedule */}
      <section className="rounded-xl border bg-background">
        <div className="border-b p-5">
          <h2 className="font-semibold">Current Load Shedding</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your currently active load shedding schedule.
          </p>
        </div>

        <div className="p-5">
          {myScheduleQuery.isLoading ? (
            <ScheduleSkeleton />
          ) : myScheduleQuery.isError ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">
                Unable to load your schedule.
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Please try refreshing the page.
              </p>
            </div>
          ) : activeSchedule ? (
            <ActiveSchedule schedule={activeSchedule} />
          ) : (
            <EmptySchedule />
          )}
        </div>
      </section>

      {/* Account information */}
      <section className="rounded-xl border bg-background">
        <div className="border-b p-5">
          <h2 className="font-semibold">Account Information</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your current account and location information.
          </p>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Name" value={user.name} icon={UserRound} />

          <InfoItem label="Email" value={user.email} />

          <InfoItem label="Role" value={user.role.replaceAll("_", " ")} />

          <InfoItem label="Job Type" value={user.jobType} />

          <InfoItem label="Zone" value={user.zone?.name} />

          <InfoItem label="Area" value={user.area?.name} />
        </div>
      </section>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>

        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold tracking-tight">{value}</p>

        <p className="mt-1 truncate text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | null;
  icon?: React.ElementType;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4 text-muted-foreground" />}

        <p className="text-xs font-medium uppercase text-muted-foreground">
          {label}
        </p>
      </div>

      <p className="mt-2 truncate text-sm font-medium">
        {value || "Not available"}
      </p>
    </div>
  );
}

function ActiveSchedule({ schedule }: { schedule: LoadSheddingSchedule }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-green-500" />

            <span className="text-xs font-medium uppercase tracking-wide text-green-600">
              Active
            </span>
          </div>

          <h3 className="mt-2 text-lg font-semibold">{schedule.name}</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {formatDate(schedule.date)}
          </p>
        </div>

        <div className="rounded-lg bg-muted px-3 py-2 text-sm">
          Required reduction:{" "}
          <span className="font-semibold">
            {schedule.requiredReductionMW} MW
          </span>
        </div>
      </div>

      {schedule.slots && schedule.slots.length > 0 ? (
        <div className="space-y-2">
          {schedule.slots.map((slot) => (
            <div
              key={slot.id}
              className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{slot.feeder.name}</p>

                <p className="text-sm text-muted-foreground">
                  {slot.feeder.code}
                </p>
              </div>

              <div className="text-sm sm:text-right">
                <p className="font-medium">
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
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
          No load-shedding slots are assigned to this schedule.
        </p>
      )}
    </div>
  );
}

function EmptySchedule() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
        <CalendarDays className="size-5 text-muted-foreground" />
      </div>

      <h3 className="mt-3 text-sm font-semibold">No active schedule</h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        There is currently no active load shedding schedule assigned to your
        area.
      </p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border bg-muted/50"
          />
        ))}
      </div>

      <div className="h-64 animate-pulse rounded-xl border bg-muted/50" />
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="h-20 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
