import {
  CalendarDays,
  Clock3,
  MapPin,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

import { ButtonLink } from "@/components/ui/button";

import type { LoadSheddingSchedule } from "@/app/(dashboard)/_features/schedules/schedule.types";

type ScheduleCardProps = {
  schedule: LoadSheddingSchedule;
};

const statusStyles: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  DRAFT: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    label: "Draft",
  },
  PENDING_APPROVAL: {
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "Pending",
  },
  APPROVED: {
    bg: "bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
    label: "Approved",
  },
  ACTIVE: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Active",
  },
};

export function ScheduleCard({ schedule }: ScheduleCardProps) {
  const slotCount = schedule._count?.slots ?? schedule.slots?.length ?? 0;
  const status =
    statusStyles[schedule.status as keyof typeof statusStyles] ??
    statusStyles.DRAFT;

  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-background p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      {/* Top accent bar */}
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 h-0.5 ${
          schedule.status === "ACTIVE"
            ? "bg-gradient-to-r from-emerald-500/40 via-emerald-500 to-emerald-500/40"
            : schedule.status === "PENDING_APPROVAL"
              ? "bg-gradient-to-r from-amber-500/40 via-amber-500 to-amber-500/40"
              : schedule.status === "APPROVED"
                ? "bg-gradient-to-r from-blue-500/40 via-blue-500 to-blue-500/40"
                : "bg-gradient-to-r from-muted-foreground/20 via-muted-foreground/40 to-muted-foreground/20"
        }`}
      />

      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{schedule.name}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            <span className="truncate">{schedule.zone.name}</span>
            <span className="text-border">•</span>
            <span className="truncate">{schedule.zone.code}</span>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full ${status.bg} ${status.text} px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider`}
        >
          <span className={`size-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </header>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Stat
          icon={CalendarDays}
          label="Date"
          value={new Date(schedule.date).toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        />
        <Stat icon={Clock3} label="Slots" value={String(slotCount)} />
        <Stat
          icon={TrendingUp}
          label="Demand"
          value={`${schedule.expectedDemandMW} MW`}
        />
        <Stat
          icon={TrendingDown}
          label="Reduction"
          value={`${schedule.requiredReductionMW} MW`}
          highlight
        />
      </div>

      <footer className="mt-5 flex items-center justify-between gap-2 border-t pt-4">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Updated{" "}
          {new Date(schedule.updatedAt).toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
          })}
        </span>
        <ButtonLink
          href={`/dashboard/schedules/${schedule.id}`}
          variant="outline"
          size="sm"
          className="h-8"
        >
          <Zap className="mr-1.5 size-3.5" />
          View
        </ButtonLink>
      </footer>
    </article>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-2.5 transition-colors ${
        highlight
          ? "border-amber-500/20 bg-amber-500/5"
          : "bg-muted/30"
      }`}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </div>
      <p
        className={`mt-1 truncate text-sm font-semibold ${
          highlight ? "text-amber-600 dark:text-amber-400" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
