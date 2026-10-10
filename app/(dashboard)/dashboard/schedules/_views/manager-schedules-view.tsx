"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CalendarPlus,
  Filter,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/app/(auth)/_features/auth.provider";
import { useSchedules } from "@/app/(dashboard)/_features/schedules/schedule.hook";
import { ScheduleList } from "@/app/(dashboard)/_components/schedule-list";

import type {
  LoadSheddingSchedule,
  ScheduleStatus,
} from "@/app/(dashboard)/_features/schedules/schedule.types";

const STATUS_OPTIONS: Array<{ label: string; value: ScheduleStatus | "ALL" }> =
  [
    { label: "All statuses", value: "ALL" },
    { label: "Draft", value: "DRAFT" },
    { label: "Pending approval", value: "PENDING_APPROVAL" },
    { label: "Approved", value: "APPROVED" },
    { label: "Active", value: "ACTIVE" },
  ];

function formatDate(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
  }).format(date);
}

function isManagerRole(role: string | undefined) {
  return role === "ZONE_MANAGER" || role === "SUPER_ADMIN";
}

export function ManagerSchedulesView() {
  const { user } = useAuth();

  const [status, setStatus] = useState<ScheduleStatus | "ALL">("ALL");
  const [date, setDate] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const filters = useMemo(
    () => ({
      ...(status !== "ALL" ? { status } : {}),
      ...(date ? { date } : {}),
    }),
    [status, date],
  );

  const query = useSchedules(filters, {
    enabled: isManagerRole(user?.role),
  });

  const schedules = useMemo<LoadSheddingSchedule[]>(
    () => query.data ?? [],
    [query.data],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return schedules;

    return schedules.filter((schedule) =>
      [schedule.name, schedule.zone?.name, schedule.zone?.code, schedule.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [schedules, search]);

  const summary = useMemo(() => {
    const counts = { DRAFT: 0, PENDING_APPROVAL: 0, APPROVED: 0, ACTIVE: 0 };

    for (const schedule of schedules) {
      const key = schedule.status as keyof typeof counts;

      if (key in counts) counts[key] += 1;
    }

    return counts;
  }, [schedules]);

  const canCreate = isManagerRole(user?.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            Load-shedding management
          </div>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Schedules
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Plan, review, and activate load-shedding schedules for your zones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canCreate && (
            <Button>
              <Link href="/dashboard/schedules/create" className="flex items-center">
                <Plus className="mr-2 size-4" />
                Create schedule
              </Link>
            </Button>
          )}

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
      </div>

      {query.isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <AlertCircle className="size-8 text-destructive" />

            <h2 className="font-semibold">Could not load schedules</h2>

            <p className="max-w-md text-sm text-muted-foreground">
              Check your connection and make sure your account has permission
              to view schedules.
            </p>

            <Button
              onClick={() => query.refetch()}
              disabled={query.isFetching}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total"
              value={query.isPending ? "—" : schedules.length}
              description="Schedules returned by API"
              icon={CalendarDays}
            />

            <SummaryCard
              title="Drafts"
              value={query.isPending ? "—" : summary.DRAFT}
              description="Pending slot planning"
              icon={CalendarPlus}
            />

            <SummaryCard
              title="Pending"
              value={query.isPending ? "—" : summary.PENDING_APPROVAL}
              description="Awaiting super-admin review"
              icon={Filter}
            />

            <SummaryCard
              title="Active"
              value={query.isPending ? "—" : summary.ACTIVE}
              description="Currently in effect"
              icon={CalendarDays}
            />
          </div>

          {/* Filters + list */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All schedules</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name, zone, or status..."
                    className="pl-9"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Select
                    value={status}
                    onValueChange={(value) =>
                      setStatus(value as ScheduleStatus | "ALL")
                    }
                  >
                    <SelectTrigger className="sm:w-52">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>

                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2 sm:w-56">
                    <Input
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className="flex-1"
                      aria-label="Filter by date"
                    />

                    {date && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDate("")}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <ScheduleList
                schedules={filtered}
                isLoading={query.isPending}
                isError={false}
              />
            </CardContent>
          </Card>

          {filtered.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {schedules.length} schedules · last
              refreshed {formatDate(new Date().toISOString())}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="rounded-xl bg-muted p-3">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
