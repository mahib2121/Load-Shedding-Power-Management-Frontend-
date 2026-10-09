"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  XCircle,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMyOutageReports } from "../../_features/outages/outage.hook";

import type { MyOutageReport } from "../../_features/outages/outage.types";

function formatDate(value?: string | null) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatStatus(value?: string | null) {
  if (!value) return "Unknown";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function StatusBadge({
  status,
  type,
}: {
  status?: string | null;
  type: "outage" | "payment";
}) {
  const normalized = status?.toUpperCase() ?? "UNKNOWN";

  const successStatuses =
    type === "payment" ? ["PAID"] : ["RESTORED", "COMPLETED"];

  const dangerStatuses =
    type === "payment" ? ["FAILED", "CANCELLED"] : ["REJECTED", "CANCELLED"];

  const isSuccess = successStatuses.includes(normalized);
  const isDanger = dangerStatuses.includes(normalized);
  const isPending =
    normalized === "PENDING" ||
    normalized === "REPORTED" ||
    normalized === "PENDING_APPROVAL";

  const Icon = isSuccess
    ? CheckCircle2
    : isDanger
      ? XCircle
      : isPending
        ? Clock3
        : Zap;

  const colorClass = isSuccess
    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    : isDanger
      ? "bg-destructive/10 text-destructive"
      : isPending
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
        : "bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${colorClass}`}
    >
      <Icon className="size-3.5" />
      {formatStatus(status)}
    </span>
  );
}

function ReportCard({ report }: { report: MyOutageReport }) {
  const areaName = report.area?.name ?? "Area unavailable";
  const feederName = report.feeder?.name;
  const outageStatus = report.outage?.status;
  const paymentStatus = report.payment?.status;

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>

            <div className="min-w-0 space-y-1">
              <h3 className="break-words font-semibold">Outage report</h3>
              <p className="break-all font-mono text-xs text-muted-foreground">
                Report ID: {report.id}
              </p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="size-3.5 shrink-0" />
                {formatDate(report.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            {outageStatus ? (
              <StatusBadge status={outageStatus} type="outage" />
            ) : (
              <StatusBadge status="AWAITING_PAYMENT" type="outage" />
            )}
          </div>
        </div>

        <div className="grid gap-3 rounded-lg bg-muted/40 p-4 sm:grid-cols-2">
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Area</p>
              <p className="break-words text-sm font-medium">{areaName}</p>
              {report.area?.code && (
                <p className="text-xs text-muted-foreground">
                  Code: {report.area.code}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Zap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Feeder</p>
              <p className="break-words text-sm font-medium">
                {feederName ?? "Not specified"}
              </p>
              {report.feeder?.code && (
                <p className="text-xs text-muted-foreground">
                  Code: {report.feeder.code}
                </p>
              )}
            </div>
          </div>
        </div>

        {report.description && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Description
            </p>
            <p className="whitespace-pre-wrap break-words text-sm">
              {report.description}
            </p>
          </div>
        )}

        {(report.latitude != null || report.longitude != null) && (
          <p className="text-xs text-muted-foreground">
            Coordinates: {report.latitude ?? "—"}, {report.longitude ?? "—"}
          </p>
        )}

        <div className="flex flex-col justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium">
              <CreditCard className="size-4 text-muted-foreground" />
              Service payment
              {report.payment && (
                <span className="font-normal text-muted-foreground">
                  {report.payment.currency}{" "}
                  {Number(report.payment.amount).toLocaleString()}
                </span>
              )}
            </p>

            {paymentStatus ? (
              <StatusBadge status={paymentStatus} type="payment" />
            ) : (
              <span className="text-xs text-muted-foreground">
                No payment information available
              </span>
            )}
          </div>

          {report.outage && (
            <p className="text-xs text-muted-foreground">
              Outage ID: {report.outage.id}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function OutagesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyOutageReports();

  const reports = (response?.data ?? []) as MyOutageReport[];

  const filteredReports = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return reports.filter((report) => {
      const outageStatus = report.outage?.status ?? "AWAITING_PAYMENT";

      const matchesStatus =
        statusFilter === "ALL" || outageStatus.toUpperCase() === statusFilter;

      const matchesSearch =
        !normalizedSearch ||
        [
          report.id,
          report.description,
          report.area?.name,
          report.area?.code,
          report.feeder?.name,
          report.feeder?.code,
          report.outage?.id,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearch),
          );

      return matchesStatus && matchesSearch;
    });
  }, [reports, search, statusFilter]);

  const paidCount = reports.filter(
    (report) => report.payment?.status === "PAID",
  ).length;

  const activeCount = reports.filter((report) =>
    ["VERIFIED", "ASSIGNED", "IN_PROGRESS"].includes(
      report.outage?.status?.toUpperCase() ?? "",
    ),
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Power Outages</h1>
          <p className="text-sm text-muted-foreground">
            Submit outage reports and track their payment and operational
            status.
          </p>
        </div>

        <Button>
          <Link href="/dashboard/outages/report">
            <AlertTriangle className="mr-2 size-4" />
            Report an outage
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <FileText className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total reports</p>
              <p className="text-2xl font-bold">
                {isLoading ? "—" : reports.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-amber-500/10 p-3 text-amber-600">
              <Clock3 className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active outages</p>
              <p className="text-2xl font-bold">
                {isLoading ? "—" : activeCount}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-600">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Payments completed
              </p>
              <p className="text-2xl font-bold">
                {isLoading ? "—" : paidCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>My reports</CardTitle>
              <CardDescription>
                Your submitted reports and their latest known status.
              </CardDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search reports, areas, feeders..."
                className="pl-9"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              aria-label="Filter reports by status"
            >
              <option value="ALL">All statuses</option>
              <option value="AWAITING_PAYMENT">Awaiting payment</option>
              <option value="REPORTED">Reported</option>
              <option value="VERIFIED">Verified</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="RESTORED">Restored</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-48 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center">
              <XCircle className="size-10 text-destructive" />
              <h3 className="font-semibold">Couldn't load your reports</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong while loading your outage reports."}
              </p>
              <Button
                variant="outline"
                onClick={() => void refetch()}
                disabled={isFetching}
              >
                Try again
              </Button>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center">
              <div className="rounded-full bg-muted p-4">
                <FileText className="size-8 text-muted-foreground" />
              </div>

              <h3 className="font-semibold">
                {reports.length === 0
                  ? "No outage reports yet"
                  : "No matching reports"}
              </h3>

              <p className="max-w-md text-sm text-muted-foreground">
                {reports.length === 0
                  ? "When you submit an outage report, it will appear here so you can track its status and payment."
                  : "Try changing your search or status filter."}
              </p>

              {reports.length === 0 && (
                <Button>
                  <Link href="/dashboard/outages/report">
                    Report an outage
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}

          {!isLoading && reports.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Showing {filteredReports.length} of {reports.length} reports.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
