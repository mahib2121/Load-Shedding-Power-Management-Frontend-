"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAuth } from "@/app/(auth)/_features/auth.provider";
import {
  useAddSlot,
  useApproveSchedule,
  useActivateSchedule,
  useDeleteSlot,
  useRejectSchedule,
  useScheduleDetail,
  useSubmitSchedule,
} from "@/app/(dashboard)/_features/schedules/schedule.hook";
import {
  addSlotSchema,
  type AddSlotFormValues,
} from "@/app/(dashboard)/_features/schedules/schedule.schema";
import type {
  LoadSheddingSchedule,
  ScheduleSlot,
  ScheduleStatus,
} from "@/app/(dashboard)/_features/schedules/schedule.types";

// ---------- helpers ----------

function formatDate(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDateOnly(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(
    date,
  );
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function humanizeStatus(status: string) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING_APPROVAL: "bg-yellow-500/10 text-yellow-600",
  APPROVED: "bg-blue-500/10 text-blue-600",
  ACTIVE: "bg-green-500/10 text-green-600",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {humanizeStatus(status)}
    </span>
  );
}

function isManager(role: string | undefined) {
  return role === "ZONE_MANAGER" || role === "SUPER_ADMIN";
}

// ---------- page ----------

export default function ScheduleDetailPage() {
  const params = useParams<{ scheduleId: string }>();
  const scheduleId = params?.scheduleId ?? "";

  const { user } = useAuth();

  const detail = useScheduleDetail(scheduleId);

  if (detail.isPending) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-56 animate-pulse rounded-xl bg-muted" />
        <div className="h-56 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (detail.isError || !detail.data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <AlertCircle className="size-8 text-destructive" />

          <h1 className="text-lg font-semibold">
            Unable to load schedule details
          </h1>

          <p className="max-w-md text-sm text-muted-foreground">
            The schedule may not exist, or your account may not have permission
            to view it.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => detail.refetch()} disabled={detail.isFetching}>
              <RefreshCw
                className={`mr-2 size-4 ${detail.isFetching ? "animate-spin" : ""}`}
              />
              Try again
            </Button>

            <Link href="/dashboard/schedules">
              <Button variant="outline">
                <ArrowLeft className="mr-2 size-4" />
                Back to schedules
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScheduleDetailContent
      schedule={detail.data}
      role={user?.role}
      onRefresh={detail.refetch}
    />
  );
}

// ---------- content ----------

function ScheduleDetailContent({
  schedule,
  role,
  onRefresh,
}: {
  schedule: LoadSheddingSchedule;
  role: string | undefined;
  onRefresh: () => void;
}) {
  const status = schedule.status as ScheduleStatus | string;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/dashboard/schedules"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to schedules
          </Link>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {schedule.name}
          </h1>

          <p className="mt-1 break-all text-xs text-muted-foreground">
            Reference: {schedule.id}
          </p>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* Actions */}
      <ScheduleActions
        schedule={schedule}
        role={role}
        onRefresh={onRefresh}
      />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryItem
          label="Date"
          value={formatDateOnly(schedule.date)}
          icon={CalendarDays}
        />

        <SummaryItem
          label="Zone"
          value={schedule.zone?.name ?? "—"}
          icon={MapPin}
        />

        <SummaryItem
          label="Required reduction"
          value={`${schedule.requiredReductionMW} MW`}
          icon={Zap}
        />

        <SummaryItem
          label="Slots"
          value={String(schedule._count?.slots ?? schedule.slots?.length ?? 0)}
          icon={Clock3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryItem
          label="Expected demand"
          value={`${schedule.expectedDemandMW} MW`}
        />

        <SummaryItem
          label="Available supply"
          value={`${schedule.availableSupplyMW} MW`}
        />

        <SummaryItem
          label="Status"
          value={humanizeStatus(status)}
        />
      </div>

      {/* Slots */}
      <SlotsSection schedule={schedule} role={role} onRefresh={onRefresh} />

      {/* Footer */}
      <p className="text-xs text-muted-foreground">
        Created {formatDate(schedule.createdAt)} · Updated{" "}
        {formatDate(schedule.updatedAt)}
      </p>
    </div>
  );
}

// ---------- summary ----------

function SummaryItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
          {Icon && <Icon className="size-3.5" />}
          {label}
        </p>
        <p className="mt-2 truncate text-sm font-medium">{value}</p>
      </CardContent>
    </Card>
  );
}

// ---------- actions ----------

function ScheduleActions({
  schedule,
  role,
  onRefresh,
}: {
  schedule: LoadSheddingSchedule;
  role: string | undefined;
  onRefresh: () => void;
}) {
  const status = String(schedule.status).toUpperCase();
  const manager = isManager(role);
  const admin = role === "SUPER_ADMIN";

  const submit = useSubmitSchedule();
  const approve = useApproveSchedule();
  const reject = useRejectSchedule();
  const activate = useActivateSchedule();

  const isBusy =
    submit.isPending ||
    approve.isPending ||
    reject.isPending ||
    activate.isPending;

  // Submit (DRAFT → PENDING_APPROVAL)
  async function handleSubmit() {
    try {
      await submit.mutateAsync(schedule.id);
      toast.success("Schedule submitted for approval");
      onRefresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit schedule",
      );
    }
  }

  // Approve (PENDING_APPROVAL → APPROVED)
  async function handleApprove() {
    try {
      await approve.mutateAsync(schedule.id);
      toast.success("Schedule approved");
      onRefresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to approve schedule",
      );
    }
  }

  // Reject (PENDING_APPROVAL → DRAFT)
  async function handleReject() {
    const ok = window.confirm(
      "Reject this schedule? It will return to DRAFT and the zone manager can revise and resubmit.",
    );

    if (!ok) return;

    try {
      await reject.mutateAsync({ scheduleId: schedule.id });
      toast.success("Schedule returned to draft");
      onRefresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reject schedule",
      );
    }
  }

  // Activate (APPROVED → ACTIVE)
  async function handleActivate() {
    const ok = window.confirm(
      "Activate this schedule? It will go into effect immediately.",
    );

    if (!ok) return;

    try {
      await activate.mutateAsync(schedule.id);
      toast.success("Schedule activated");
      onRefresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to activate schedule",
      );
    }
  }

  // Show no actions card if nothing applies.
  const showSubmit = manager && status === "DRAFT";
  const showApproveReject = admin && status === "PENDING_APPROVAL";
  const showActivate = admin && status === "APPROVED";

  if (!showSubmit && !showApproveReject && !showActivate) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Lifecycle actions</CardTitle>
        <CardDescription>
          {status === "DRAFT" && manager
            ? "Submit this schedule for super-admin approval."
            : status === "PENDING_APPROVAL" && admin
              ? "Approve to mark the schedule as ready, or reject to send it back to the zone manager."
              : status === "APPROVED" && admin
                ? "Activate this schedule to put it into effect for customers."
                : null}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-2">
        {showSubmit && (
          <Button
            onClick={handleSubmit}
            disabled={isBusy}
            data-testid="schedule-submit"
          >
            {submit.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Send className="mr-2 size-4" />
            )}
            Submit for approval
          </Button>
        )}

        {showApproveReject && (
          <>
            <Button onClick={handleApprove} disabled={isBusy}>
              {approve.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 size-4" />
              )}
              Approve
            </Button>

            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isBusy}
            >
              {reject.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 size-4" />
              )}
              Reject
            </Button>
          </>
        )}

        {showActivate && (
          <Button onClick={handleActivate} disabled={isBusy}>
            {activate.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 size-4" />
            )}
            Activate
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ---------- slots ----------

function SlotsSection({
  schedule,
  role,
  onRefresh,
}: {
  schedule: LoadSheddingSchedule;
  role: string | undefined;
  onRefresh: () => void;
}) {
  const status = String(schedule.status).toUpperCase();

  const canManage = isManager(role) && status === "DRAFT";

  const slots = schedule.slots ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Load-shedding slots</CardTitle>

        <CardDescription>
          {canManage
            ? "Add at least one slot before submitting for approval."
            : `This schedule has ${slots.length} slot${slots.length === 1 ? "" : "s"}.`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {canManage && <AddSlotForm scheduleId={schedule.id} />}

        {slots.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Clock3 className="mx-auto size-7 text-muted-foreground" />
            <p className="mt-2 font-medium">No slots yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {canManage
                ? "Use the form above to add a feeder slot."
                : "Slots will appear here once they are added."}
            </p>
          </div>
        ) : (
          <SlotsTable slots={slots} canDelete={canManage} onChanged={onRefresh} />
        )}
      </CardContent>
    </Card>
  );
}

function AddSlotForm({ scheduleId }: { scheduleId: string }) {
  const add = useAddSlot(scheduleId);

  const form = useForm({
    defaultValues: {
      feederId: "",
      startTime: "",
      endTime: "",
      durationHours: 1,
      plannedLoadReductionMW: 0,
    } as AddSlotFormValues,

    validators: {
      onSubmit: addSlotSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        await add.mutateAsync({
          feederId: value.feederId.trim(),
          startTime: value.startTime,
          endTime: value.endTime,
          durationHours: Number(value.durationHours),
          plannedLoadReductionMW: Number(value.plannedLoadReductionMW),
        });

        toast.success("Slot added");

        form.reset();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to add slot",
        );
      }
    },
  });

  const isPending = add.isPending;

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <form.Field name="feederId">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={`feeder-${scheduleId}`}>Feeder ID</FieldLabel>
                <Input
                  id={`feeder-${scheduleId}`}
                  name={field.name}
                  placeholder="Feeder UUID"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  disabled={isPending}
                />
                {field.state.meta.errors.length > 0 ? (
                  <FieldError>
                    {field.state.meta.errors.map((error) => (
                      <div key={error?.message}>{error?.message}</div>
                    ))}
                  </FieldError>
                ) : (
                  <FieldDescription>UUID of the feeder.</FieldDescription>
                )}
              </Field>
            )}
          </form.Field>

          <form.Field name="startTime">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={`start-${scheduleId}`}>Start</FieldLabel>
                <Input
                  id={`start-${scheduleId}`}
                  name={field.name}
                  type="datetime-local"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  disabled={isPending}
                />
                {field.state.meta.errors.length > 0 && (
                  <FieldError>
                    {field.state.meta.errors.map((error) => (
                      <div key={error?.message}>{error?.message}</div>
                    ))}
                  </FieldError>
                )}
              </Field>
            )}
          </form.Field>

          <form.Field name="endTime">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={`end-${scheduleId}`}>End</FieldLabel>
                <Input
                  id={`end-${scheduleId}`}
                  name={field.name}
                  type="datetime-local"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  disabled={isPending}
                />
                {field.state.meta.errors.length > 0 && (
                  <FieldError>
                    {field.state.meta.errors.map((error) => (
                      <div key={error?.message}>{error?.message}</div>
                    ))}
                  </FieldError>
                )}
              </Field>
            )}
          </form.Field>

          <form.Field name="durationHours">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={`dur-${scheduleId}`}>
                  Duration (h)
                </FieldLabel>
                <Select
                  value={String(field.state.value)}
                  onValueChange={(value) =>
                    field.handleChange(Number(value) as never)
                  }
                >
                  <SelectTrigger id={`dur-${scheduleId}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <FieldError>
                    {field.state.meta.errors.map((error) => (
                      <div key={error?.message}>{error?.message}</div>
                    ))}
                  </FieldError>
                )}
              </Field>
            )}
          </form.Field>

          <form.Field name="plannedLoadReductionMW">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={`red-${scheduleId}`}>Reduction (MW)</FieldLabel>
                <Input
                  id={`red-${scheduleId}`}
                  name={field.name}
                  type="number"
                  min={0}
                  step="0.01"
                  value={
                    field.state.value === undefined ||
                    (field.state.value as unknown) === ""
                      ? ""
                      : String(field.state.value)
                  }
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    const v = event.target.value;
                    field.handleChange(
                      v === "" ? ("" as never) : (Number(v) as never),
                    );
                  }}
                  disabled={isPending}
                />
                {field.state.meta.errors.length > 0 ? (
                  <FieldError>
                    {field.state.meta.errors.map((error) => (
                      <div key={error?.message}>{error?.message}</div>
                    ))}
                  </FieldError>
                ) : (
                  <FieldDescription>MW to shed.</FieldDescription>
                )}
              </Field>
            )}
          </form.Field>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Plus className="mr-2 size-4" />
            )}
            Add slot
          </Button>
        </div>
      </form>
    </div>
  );
}

function SlotsTable({
  slots,
  canDelete,
  onChanged,
}: {
  slots: ScheduleSlot[];
  canDelete: boolean;
  onChanged: () => void;
}) {
  const remove = useDeleteSlot();

  async function handleDelete(slotId: string) {
    const ok = window.confirm(
      "Delete this slot? This action cannot be undone.",
    );

    if (!ok) return;

    try {
      await remove.mutateAsync(slotId);
      toast.success("Slot deleted");
      onChanged();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete slot",
      );
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Feeder</TableHead>
          <TableHead>Start</TableHead>
          <TableHead>End</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Reduction</TableHead>
          {canDelete && <TableHead className="w-12" />}
        </TableRow>
      </TableHeader>

      <TableBody>
        {slots.map((slot) => (
          <TableRow key={slot.id}>
            <TableCell>
              <div className="font-medium">{slot.feeder?.name ?? "—"}</div>
              <div className="text-xs text-muted-foreground">
                {slot.feeder?.code ?? ""}
              </div>
            </TableCell>

            <TableCell>{formatTime(slot.startTime)}</TableCell>
            <TableCell>{formatTime(slot.endTime)}</TableCell>
            <TableCell>{slot.durationHours} h</TableCell>
            <TableCell>{slot.plannedLoadReductionMW} MW</TableCell>

            {canDelete && (
              <TableCell>
                <Button
                  size="icon-sm"
                  variant="destructive"
                  onClick={() => handleDelete(slot.id)}
                  disabled={remove.isPending}
                  aria-label="Delete slot"
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
