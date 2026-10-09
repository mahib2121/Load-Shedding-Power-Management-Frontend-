"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  ClipboardList,
  MapPin,
  RefreshCw,
  Search,
  Zap,
} from "lucide-react";

import { useMyOutageReports } from "../../_features/outages/outage.hook";
import type { MyOutageReport } from "../../_features/outages/outage.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function formatDate(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getReportStatus(report: MyOutageReport) {
  if (report.outage?.status) return report.outage.status;

  const paymentStatus = report.payment?.status?.toUpperCase();

  if (paymentStatus === "PAID") return "AWAITING_PROCESSING";
  if (paymentStatus === "FAILED") return "PAYMENT_FAILED";
  if (paymentStatus === "CANCELLED") return "PAYMENT_CANCELLED";

  return "AWAITING_PAYMENT";
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    RESTORED: "bg-emerald-100 text-emerald-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    ASSIGNED: "bg-violet-100 text-violet-800",
    VERIFIED: "bg-sky-100 text-sky-800",
    REJECTED: "bg-red-100 text-red-800",
    PAYMENT_FAILED: "bg-red-100 text-red-800",
    PAYMENT_CANCELLED: "bg-red-100 text-red-800",
    AWAITING_PAYMENT: "bg-amber-100 text-amber-800",
    AWAITING_PROCESSING: "bg-amber-100 text-amber-800",
  };

  const label = status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {label}
    </span>
  );
}

function ReportCard({ report }: { report: MyOutageReport }) {
  const status = getReportStatus(report);

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="break-all text-xs text-muted-foreground">
              Report reference: {report.id}
            </p>

            <h3 className="mt-1 font-semibold">
              {report.area?.name ?? "Area unavailable"}
            </h3>

            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              {report.area?.code ?? "Area code unavailable"}
              {report.feeder?.name ? ` · ${report.feeder.name}` : ""}
            </p>
          </div>

          <StatusBadge status={status} />
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Description</p>
            <p className="mt-1">
              {report.description?.trim() || "No description provided"}
            </p>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4" />
            Reported {formatDate(report.createdAt)}
          </div>

          <div className="flex items-center justify-between gap-3 border-t pt-3">
            <div>
              <p className="text-xs text-muted-foreground">Service fee</p>
              <p className="mt-1 font-medium">
                {report.payment
                  ? `${report.payment.currency} ${report.payment.amount}`
                  : "Not available"}
              </p>
            </div>

            {report.payment && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Payment</p>
                <p className="mt-1 font-medium">{report.payment.status}</p>
              </div>
            )}
          </div>
        </div>

        {report.outage && (
          <Button variant="outline" className="w-full">
            <Link href={`/dashboard/outages/${report.outage.id}`}>
              <Zap className="mr-2 size-4" />
              View outage details
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function CustomerOutagesView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const query = useMyOutageReports();
  const reports = query.data?.data ?? [];

  const filteredReports = useMemo(() => {
    const term = search.trim().toLowerCase();

    return reports.filter((report) => {
      const status = getReportStatus(report);

      const matchesStatus = statusFilter === "ALL" || status === statusFilter;

      const matchesSearch =
        !term ||
        [
          report.id,
          report.area?.name,
          report.area?.code,
          report.feeder?.name,
          report.description,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));

      return matchesStatus && matchesSearch;
    });
  }, [reports, search, statusFilter]);

  const paidCount = reports.filter(
    (report) => report.payment?.status?.toUpperCase() === "PAID",
  ).length;

  const activeCount = reports.filter((report) =>
    ["VERIFIED", "ASSIGNED", "IN_PROGRESS"].includes(
      report.outage?.status?.toUpperCase() ?? "",
    ),
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClipboardList className="size-4" />
            Customer services
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            My outage reports
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your submitted reports, payments, and restoration progress.
          </p>
        </div>

        <Button>
          <Link href="/dashboard/outages/report">
            <Zap className="mr-2 size-4" />
            Report an outage
          </Link>
        </Button>
      </div>

      {query.isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <AlertCircle className="size-8 text-destructive" />
            <h2 className="font-semibold">Could not load your reports</h2>
            <p className="text-sm text-muted-foreground">Please try again.</p>
            <Button onClick={() => query.refetch()} disabled={query.isFetching}>
              <RefreshCw className="mr-2 size-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Total reports</p>
                <p className="mt-2 text-2xl font-semibold">
                  {query.isPending ? "—" : reports.length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Active outages</p>
                <p className="mt-2 text-2xl font-semibold">
                  {query.isPending ? "—" : activeCount}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Paid reports</p>
                <p className="mt-2 text-2xl font-semibold">
                  {query.isPending ? "—" : paidCount}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Report history</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search by area, feeder, or reference..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <select
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter reports by status"
                >
                  <option value="ALL">All statuses</option>
                  <option value="AWAITING_PAYMENT">Awaiting payment</option>
                  <option value="AWAITING_PROCESSING">
                    Awaiting processing
                  </option>
                  <option value="VERIFIED">Verified</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="RESTORED">Restored</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="PAYMENT_FAILED">Payment failed</option>
                  <option value="PAYMENT_CANCELLED">Payment cancelled</option>
                </select>
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
              ) : filteredReports.length === 0 ? (
                <div className="py-12 text-center">
                  <ClipboardList className="mx-auto size-9 text-muted-foreground" />
                  <h3 className="mt-3 font-semibold">No reports found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Submit an outage report or try a different search.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {filteredReports.map((report) => (
                    <ReportCard key={report.id} report={report} />
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
