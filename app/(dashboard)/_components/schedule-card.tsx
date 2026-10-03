import Link from "next/link";

import { CalendarDays, Clock3, MapPin, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { LoadSheddingSchedule } from "@/app/(dashboard)/_features/schedules/schedule.types";

type ScheduleCardProps = {
  schedule: LoadSheddingSchedule;
};

const statusStyles = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING_APPROVAL: "bg-yellow-500/10 text-yellow-600",
  APPROVED: "bg-blue-500/10 text-blue-600",
  ACTIVE: "bg-green-500/10 text-green-600",
};

export function ScheduleCard({ schedule }: ScheduleCardProps) {
  const slotCount = schedule._count?.slots ?? schedule.slots?.length ?? 0;

  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{schedule.name}</h3>

          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {schedule.zone.name}
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            statusStyles[schedule.status]
          }`}
        >
          {schedule.status.replaceAll("_", " ")}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4" />
            Date
          </div>

          <p className="mt-1 font-medium">
            {new Date(schedule.date).toLocaleDateString()}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock3 className="size-4" />
            Slots
          </div>

          <p className="mt-1 font-medium">{slotCount}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="size-4" />
            Demand
          </div>

          <p className="mt-1 font-medium">{schedule.expectedDemandMW} MW</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="size-4" />
            Required Reduction
          </div>

          <p className="mt-1 font-medium">{schedule.requiredReductionMW} MW</p>
        </div>
      </div>

      <div className="mt-5 border-t pt-4">
        <Button variant="outline" size="sm">
          <Link href={`/dashboard/schedules/${schedule.id}`}>
            View Schedule
          </Link>
        </Button>
      </div>
    </div>
  );
}
