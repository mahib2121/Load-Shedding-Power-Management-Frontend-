"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  ClipboardList,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

import { useOperationalOutages } from "../../_features/outages/outage.hook";
import type { OperationalOutage } from "../../_features/outages/outage.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Restored", value: "RESTORED" },
];

function formatDate(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function humanizeStatus(status: string) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    VERIFIED: "bg-blue-100 text-blue-800",
    ASSIGNED: "bg-violet-100 text-violet-800",
    IN_PROGRESS: "bg-amber-100 text-amber-800",
    RESTORED: "bg-emerald-100 text-emerald-800",
    REPORTED: "bg-slate-100 text-slate-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status.toUpperCase()] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {humanizeStatus(status)}
    </span>
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
  icon: typeof Zap;
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

function OutageCard({ outage }: { outage: OperationalOutage }) {
  const assignments = outage.assignments ?? [];

  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="break-all text-xs text-muted-foreground">
              Reference: {outage.id}
            </p>

            <h3 className="mt-1 font-semibold">
              {outage.area?.name ?? "Area unavailable"}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Feeder: {outage.feeder?.name ?? "Not available"}
            </p>
          </div>

          <StatusBadge status={outage.status} />
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Zone</p>
            <p className="mt-1 font-medium">
              {outage.zone?.name ?? "Not available"}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Reported</p>
            <p className="mt-1 font-medium">{formatDate(outage.createdAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Related reports</p>
            <p className="mt-1 font-medium">
              {outage._count?.reports ?? "Not available"}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Technicians</p>
            <p className="mt-1 font-medium">
              {assignments.length === 0
                ? "No assignment"
                : assignments
                    .map(
                      (assignment) =>
                        assignment.technician?.name ??
                        "Technician details unavailable",
                    )
                    .join(", ")}
            </p>
          </div>
        </div>

        <div className="border-t pt-3">
          <Button variant="outline" className="w-full sm:w-auto">
            <Link href={`/dashboard/outages/${outage.id}`}>
              View details
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function OperationalOutagesView() {
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const query = useOperationalOutages(status === "ALL" ? undefined : status);

  const outages = query.data?.data ?? [];

  const filteredOutages = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return outages;

    return outages.filter((outage) =>
      [
        outage.id,
        outage.area?.name,
        outage.area?.code,
        outage.feeder?.name,
        outage.feeder?.code,
        outage.zone?.name,
        outage.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [outages, search]);

  const activeCount = outages.filter((outage) =>
    ["VERIFIED", "ASSIGNED", "IN_PROGRESS"].includes(
      outage.status.toUpperCase(),
    ),
  ).length;

  const inProgressCount = outages.filter(
    (outage) => outage.status.toUpperCase() === "IN_PROGRESS",
  ).length;

  const restoredCount = outages.filter(
    (outage) => outage.status.toUpperCase() === "RESTORED",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4" />
            Field operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Outage management
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Review incidents and monitor repair progress.
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

      {query.isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <AlertCircle className="size-8 text-destructive" />

            <h2 className="font-semibold">Could not load outages</h2>

            <p className="text-sm text-muted-foreground">
              Check your connection and make sure your account has permission to
              view operational outages.
            </p>

            <Button onClick={() => query.refetch()} disabled={query.isFetching}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Outages"
              value={query.isPending ? "—" : outages.length}
              description="Incidents returned by the API"
              icon={ClipboardList}
            />

            <SummaryCard
              title="Active incidents"
              value={query.isPending ? "—" : activeCount}
              description="Verified, assigned, or in progress"
              icon={Zap}
            />

            <SummaryCard
              title="Repairs in progress"
              value={query.isPending ? "—" : inProgressCount}
              description="Currently being repaired"
              icon={Users}
            />

            <SummaryCard
              title="Restored"
              value={query.isPending ? "—" : restoredCount}
              description="Restoration recorded"
              icon={ShieldCheck}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Operational incidents</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search reference, area, feeder, or zone..."
                    className="pl-9"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {FILTERS.map((filter) => (
                    <Button
                      key={filter.value}
                      size="sm"
                      variant={status === filter.value ? "default" : "outline"}
                      onClick={() => setStatus(filter.value)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>

              {query.isPending ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-56 animate-pulse rounded-xl bg-muted"
                    />
                  ))}
                </div>
              ) : filteredOutages.length === 0 ? (
                <div className="py-12 text-center">
                  <ClipboardList className="mx-auto size-9 text-muted-foreground" />

                  <h3 className="mt-3 font-semibold">No outages found</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Try another status filter or search term.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {filteredOutages.map((outage) => (
                    <OutageCard key={outage.id} outage={outage} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
