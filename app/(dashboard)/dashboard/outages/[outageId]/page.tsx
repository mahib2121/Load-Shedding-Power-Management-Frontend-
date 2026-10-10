"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  UserRound,
  Zap,
} from "lucide-react";

import { OutageLifecycleActions } from "../outage-lifecycle-actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OutageDetail } from "@/app/(dashboard)/_features/outages/outage.types";
import { useOutageDetail } from "@/app/(dashboard)/_features/outages/outage.hook";

function formatDate(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function humanizeStatus(status?: string | null) {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  const styles: Record<string, string> = {
    REPORTED: "bg-slate-100 text-slate-800",
    VERIFIED: "bg-blue-100 text-blue-800",
    ASSIGNED: "bg-violet-100 text-violet-800",
    IN_PROGRESS: "bg-amber-100 text-amber-800",
    RESTORED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
        styles[normalized] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {humanizeStatus(status)}
    </span>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b py-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="break-words text-sm font-medium sm:max-w-[65%] sm:text-right">
        {value}
      </span>
    </div>
  );
}

function TimelineItem({
  title,
  date,
}: {
  title: string;
  date?: string | null;
}) {
  const complete = Boolean(date);

  return (
    <div className="flex gap-3">
      <div className="mt-0.5">
        {complete ? (
          <CheckCircle2 className="size-5 text-emerald-600" />
        ) : (
          <Clock className="size-5 text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0 flex-1 pb-5">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{formatDate(date)}</p>
      </div>
    </div>
  );
}

function OutageDetailContent({ outage }: { outage: OutageDetail }) {
  const assignments = outage.assignments ?? [];
  const reports = outage.reports ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="size-4" />
            Outage management
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Outage details
          </h1>

          <p className="mt-1 break-all text-sm text-muted-foreground">
            Reference: {outage.id}
          </p>
        </div>

        <StatusBadge status={outage.status} />
      </div>

      {/* Lifecycle actions */}
      <OutageLifecycleActions outageId={outage.id} status={outage.status} />

      {/* Main details */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4" />
              Location and report
            </CardTitle>
          </CardHeader>

          <CardContent>
            <DetailRow
              label="Area"
              value={outage.area?.name ?? "Not available"}
            />

            <DetailRow
              label="Area code"
              value={outage.area?.code ?? "Not available"}
            />

            <DetailRow
              label="Feeder"
              value={outage.feeder?.name ?? "Not available"}
            />

            <DetailRow
              label="Feeder code"
              value={outage.feeder?.code ?? "Not available"}
            />

            <DetailRow
              label="Substation"
              value={outage.feeder?.substation?.name ?? "Not available"}
            />

            <DetailRow
              label="Zone"
              value={outage.zone?.name ?? "Not available"}
            />

            <DetailRow label="Reported" value={formatDate(outage.createdAt)} />

            <DetailRow
              label="Last updated"
              value={formatDate(outage.updatedAt)}
            />

            <DetailRow
              label="Description"
              value={outage.description?.trim() || "No description provided"}
            />

            <DetailRow
              label="Coordinates"
              value={
                outage.latitude != null && outage.longitude != null
                  ? `${outage.latitude}, ${outage.longitude}`
                  : "Not provided"
              }
            />
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="size-4" />
              Outage timeline
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-2">
            <TimelineItem title="Report created" date={outage.createdAt} />

            <TimelineItem title="Outage verified" date={outage.verifiedAt} />

            <TimelineItem title="Repair started" date={outage.startedAt} />

            <TimelineItem title="Power restored" date={outage.restoredAt} />
          </CardContent>
        </Card>
      </div>

      {/* Technician assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserRound className="size-4" />
            Technician assignments
          </CardTitle>
        </CardHeader>

        <CardContent>
          {assignments.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">
              No technician assignments are available yet.
            </p>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium">
                        {assignment.technician?.name ??
                          "Technician details unavailable"}
                      </p>

                      {assignment.technician?.email && (
                        <p className="text-sm text-muted-foreground">
                          {assignment.technician.email}
                        </p>
                      )}
                    </div>

                    <StatusBadge status={assignment.status} />
                  </div>

                  {assignment.notes && (
                    <p className="mt-3 text-sm">{assignment.notes}</p>
                  )}

                  <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground">Assigned</p>
                      <p className="mt-1">
                        {formatDate(assignment.assignedAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Accepted</p>
                      <p className="mt-1">
                        {formatDate(assignment.acceptedAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Started</p>
                      <p className="mt-1">{formatDate(assignment.startedAt)}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Completed</p>
                      <p className="mt-1">
                        {formatDate(assignment.completedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Related reports */}
      {reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Related customer reports
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-lg border p-4">
                <p className="text-sm">
                  {report.description?.trim() ||
                    "No additional description provided"}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Submitted {formatDate(report.createdAt)}
                  {report.reporter?.name ? ` · ${report.reporter.name}` : ""}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div>
        <Button variant="outline">
          <Link href="/dashboard/outages">
            <ArrowLeft className="mr-2 size-4" />
            Back to outages
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function OutageDetailPage() {
  const params = useParams<{ outageId: string }>();
  const outageId = params.outageId;

  const {
    data: response,
    isPending,
    isError,
    refetch,
    isFetching,
  } = useOutageDetail(outageId);

  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-56 animate-pulse rounded-xl bg-muted" />
        <div className="h-56 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <AlertCircle className="size-8 text-destructive" />

          <h1 className="text-lg font-semibold">
            Unable to load outage details
          </h1>

          <p className="max-w-md text-sm text-muted-foreground">
            The outage may not exist, or your account may not have permission to
            view it.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className="mr-2 size-4" />
              Try again
            </Button>

            <Button variant="outline">
              <Link href="/dashboard/outages">Back to outages</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <OutageDetailContent outage={response.data} />;
}
