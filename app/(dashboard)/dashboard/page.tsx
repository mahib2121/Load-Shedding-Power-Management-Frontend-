"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Gauge,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plug,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";

import { Button, ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuth } from "@/app/(auth)/_features/auth.provider";
import { useMySchedule } from "@/app/(dashboard)/_features/schedules/schedule.hook";
import type { LoadSheddingSchedule } from "@/app/(dashboard)/_features/schedules/schedule.types";

const ROLE_LABEL: Record<string, string> = {
  CUSTOMER: "Customer",
  FIELD_OPERATOR: "Field Operator",
  ZONE_MANAGER: "Zone Manager",
  SUPER_ADMIN: "Super Admin",
};

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
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
  const nextSlot = pickNextSlot(activeSchedule);
  const greeting = getGreeting();
  const role = ROLE_LABEL[user.role] ?? user.role;

  return (
    <div className="space-y-6">
      {/* Hero greeting */}
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div
          aria-hidden
          className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/15 blur-3xl"
        />
        <CardContent className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" />
              {greeting}
            </div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              {user.name?.split(" ")[0] ?? "Welcome"} 👋
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Here&apos;s a quick look at your power status today. You have{" "}
              <span className="font-semibold text-foreground">
                {schedules.length} schedule{schedules.length === 1 ? "" : "s"}
              </span>{" "}
              and{" "}
              <span className="font-semibold text-foreground">
                {totalSlots} slot{totalSlots === 1 ? "" : "s"}
              </span>{" "}
              on file.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-2.5 py-1 text-xs font-medium backdrop-blur">
                <ShieldCheck className="size-3 text-emerald-500" />
                {role}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-2.5 py-1 text-xs font-medium backdrop-blur">
                <MapPin className="size-3 text-primary" />
                {user.zone?.name ?? "No zone assigned"}
              </span>
              {user.area?.name && (
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-2.5 py-1 text-xs font-medium backdrop-blur">
                  <MapPin className="size-3 text-muted-foreground" />
                  {user.area.name}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
            <ButtonLink
              href="/dashboard/schedules"
              variant="default"
              className="h-10"
            >
              <CalendarDays className="mr-1.5 size-4" />
              My Schedules
              <ArrowRight className="ml-1.5 size-4" />
            </ButtonLink>
            <ButtonLink
              href="/dashboard/outages"
              variant="outline"
              className="h-10 bg-background/60 backdrop-blur"
            >
              <Zap className="mr-1.5 size-4" />
              Live Outages
            </ButtonLink>
          </div>
        </CardContent>
      </Card>

      {/* Status banner */}
      <StatusBanner
        isError={myScheduleQuery.isError}
        isLoading={myScheduleQuery.isLoading}
      />

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Power Status"
          value="Normal"
          description="Grid is stable in your area"
          icon={Activity}
          accent="emerald"
        />
        <KpiCard
          title="Active Schedules"
          value={String(activeSchedule ? 1 : 0)}
          description={activeSchedule ? activeSchedule.name : "No active schedule"}
          icon={CalendarDays}
          accent="primary"
        />
        <KpiCard
          title="Total Schedules"
          value={String(schedules.length)}
          description="All schedules on file"
          icon={Clock3}
          accent="violet"
        />
        <KpiCard
          title="Total Slots"
          value={String(totalSlots)}
          description="Planned load-shedding slots"
          icon={Gauge}
          accent="amber"
        />
      </div>

      {/* Two-column section: schedule timeline + quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Schedule / timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Zap className="size-3.5" />
                  </span>
                  Today&apos;s Load Shedding
                </CardTitle>
                <CardDescription>
                  Your active schedule and upcoming slots
                </CardDescription>
              </div>
              <ButtonLink
                href="/dashboard/schedules"
                variant="ghost"
                size="sm"
                className="h-8"
              >
                View all
                <ArrowRight className="ml-1 size-3.5" />
              </ButtonLink>
            </div>
          </CardHeader>

          <CardContent>
            {myScheduleQuery.isLoading ? (
              <ScheduleSkeleton />
            ) : myScheduleQuery.isError ? (
              <ErrorState
                title="Unable to load your schedule"
                description="Please try refreshing the page."
                onRetry={() => void myScheduleQuery.refetch()}
              />
            ) : activeSchedule ? (
              <div className="space-y-5">
                <ActiveScheduleBanner schedule={activeSchedule} />
                <ScheduleTimeline schedule={activeSchedule} />
                {nextSlot && <NextSlotCallout slot={nextSlot} />}
              </div>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>

        {/* Quick actions + System health */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="size-3.5" />
                </span>
                Quick Actions
              </CardTitle>
              <CardDescription>Jump to common tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <QuickAction
                href="/dashboard/schedules"
                icon={CalendarDays}
                title="View Schedules"
                description="Browse your load shedding"
              />
              <QuickAction
                href="/dashboard/outages"
                icon={Zap}
                title="Report Outage"
                description="Notify your utility"
              />
              <QuickAction
                href="/dashboard/payments"
                icon={CreditCard}
                title="Make Payment"
                description="View and pay bills"
              />
              <QuickAction
                href="/dashboard/profile"
                icon={UserRound}
                title="Edit Profile"
                description="Update your details"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Activity className="size-3.5" />
                </span>
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <HealthRow
                label="Grid Status"
                value="Stable"
                tone="emerald"
                icon={Activity}
              />
              <HealthRow
                label="API Latency"
                value="42 ms"
                tone="emerald"
                icon={Gauge}
              />
              <HealthRow
                label="Alerts Sent"
                value="12 today"
                tone="primary"
                icon={Bell}
              />
              <HealthRow
                label="Last Sync"
                value="Just now"
                tone="muted"
                icon={RefreshCcw}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Account information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UserRound className="size-3.5" />
                </span>
                Account Information
              </CardTitle>
              <CardDescription>
                Your current account and location details
              </CardDescription>
            </div>
            <ButtonLink
              href="/dashboard/profile"
              variant="ghost"
              size="sm"
              className="h-8"
            >
              Edit profile
              <ArrowRight className="ml-1 size-3.5" />
            </ButtonLink>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Full Name" value={user.name} icon={UserRound} />
            <InfoItem label="Email" value={user.email} icon={Mail} />
            <InfoItem label="Phone" value={user.phone} icon={Phone} />
            <InfoItem label="Role" value={role} icon={ShieldCheck} />
            <InfoItem label="Job Type" value={user.jobType} icon={Plug} />
            <InfoItem label="Zone" value={user.zone?.name} icon={MapPin} />
            <InfoItem label="Area" value={user.area?.name} icon={MapPin} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ===================== Components ===================== */

function StatusBanner({
  isError,
  isLoading,
}: {
  isError: boolean;
  isLoading: boolean;
}) {
  if (isLoading) return null;

  if (isError) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm">
        <AlertTriangle className="size-4 shrink-0 text-destructive" />
        <div className="flex-1">
          <p className="font-medium text-destructive">
            Couldn&apos;t refresh your schedule
          </p>
          <p className="text-xs text-muted-foreground">
            We&apos;ll keep trying in the background.
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-8">
          <RefreshCcw className="mr-1.5 size-3.5" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent px-4 py-3 text-sm">
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
      </span>
      <div className="flex-1">
        <p className="font-medium">All systems operational</p>
        <p className="text-xs text-muted-foreground">
          Power grid is stable across your zone.
        </p>
      </div>
      <span className="hidden text-xs text-muted-foreground sm:inline">
        Updated just now
      </span>
    </div>
  );
}

type KpiAccent = "primary" | "emerald" | "violet" | "amber";

const ACCENTS: Record<
  KpiAccent,
  { ring: string; bg: string; text: string; bar: string }
> = {
  primary: {
    ring: "ring-primary/15",
    bg: "bg-primary/10",
    text: "text-primary",
    bar: "from-primary/40 to-primary",
  },
  emerald: {
    ring: "ring-emerald-500/15",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    bar: "from-emerald-500/40 to-emerald-500",
  },
  violet: {
    ring: "ring-violet-500/15",
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    bar: "from-violet-500/40 to-violet-500",
  },
  amber: {
    ring: "ring-amber-500/15",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    bar: "from-amber-500/40 to-amber-500",
  },
};

function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  accent: KpiAccent;
}) {
  const a = ACCENTS[accent];
  return (
    <Card className={`relative overflow-hidden ring-1 ${a.ring}`}>
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${a.bar}`}
      />
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <div
            className={`flex size-9 items-center justify-center rounded-lg ${a.bg} ${a.text}`}
          >
            <Icon className="size-4" />
          </div>
        </div>
        <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function ActiveScheduleBanner({ schedule }: { schedule: LoadSheddingSchedule }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
        </span>
        <div>
          <p className="text-sm font-semibold">{schedule.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(schedule.date)} • {schedule.zone.name}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium ring-1 ring-emerald-500/20">
          Required reduction:{" "}
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {schedule.requiredReductionMW} MW
          </span>
        </span>
      </div>
    </div>
  );
}

function ScheduleTimeline({ schedule }: { schedule: LoadSheddingSchedule }) {
  const slots = schedule.slots ?? [];

  if (!slots.length) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No load-shedding slots are assigned to this schedule.
      </p>
    );
  }

  return (
    <ol className="relative space-y-3 border-l-2 border-dashed border-muted pl-5">
      {slots.map((slot, idx) => (
        <li key={slot.id} className="relative">
          <span className="absolute -left-[27px] top-1.5 flex size-4 items-center justify-center rounded-full border-2 border-background bg-primary text-[8px] text-primary-foreground">
            {idx + 1}
          </span>
          <div className="flex flex-col gap-2 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">{slot.feeder.name}</p>
              <p className="text-xs text-muted-foreground">
                {slot.feeder.code}
              </p>
            </div>
            <div className="flex items-center gap-3 sm:flex-row-reverse sm:text-right">
              <div>
                <p className="text-sm font-medium">
                  {formatTime(slot.startTime)} –{" "}
                  {formatTime(slot.endTime)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {slot.plannedLoadReductionMW} MW reduction
                </p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function NextSlotCallout({
  slot,
}: {
  slot: NonNullable<LoadSheddingSchedule["slots"]>[number];
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
        <Clock3 className="size-4" />
      </span>
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Next slot
        </p>
        <p className="text-sm font-medium">
          {formatTime(slot.startTime)} – {formatTime(slot.endTime)} on{" "}
          {slot.feeder.name}
        </p>
        <p className="text-xs text-muted-foreground">
          Plan ahead — charge devices before this time.
        </p>
      </div>
      <ButtonLink
        href="/dashboard/schedules"
        variant="outline"
        size="sm"
        className="h-8 shrink-0"
      >
        Details
        <ArrowRight className="ml-1 size-3.5" />
      </ButtonLink>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-lg border bg-background p-3 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}

function HealthRow({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  tone: "emerald" | "primary" | "muted";
  icon: React.ElementType;
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : tone === "primary"
        ? "bg-primary/10 text-primary"
        : "bg-muted text-muted-foreground";
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span
          className={`flex size-7 items-center justify-center rounded-md ${toneClass}`}
        >
          <Icon className="size-3.5" />
        </span>
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-xs font-medium text-muted-foreground">{value}</span>
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
    <div className="rounded-lg border bg-muted/20 p-3.5">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="size-3.5" />}
        {label}
      </div>
      <p className="mt-1.5 truncate text-sm font-medium">
        {value || (
          <span className="text-muted-foreground/70">Not available</span>
        )}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-6" />
      </div>
      <h3 className="mt-3 text-sm font-semibold">No active schedule</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        There is currently no active load shedding schedule in your area. Power
        supply is normal.
      </p>
      <ButtonLink
        href="/dashboard/schedules"
        variant="outline"
        size="sm"
        className="mt-4"
      >
        <CalendarDays className="mr-1.5 size-3.5" />
        Browse all schedules
      </ButtonLink>
    </div>
  );
}

function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
      <div className="flex-1">
        <p className="text-sm font-medium text-destructive">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => onRetry()}
        >
          <RefreshCcw className="mr-1.5 size-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-40 animate-pulse rounded-xl border bg-muted/30" />
      <div className="h-12 animate-pulse rounded-xl border bg-muted/30" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl border bg-muted/30"
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-xl border bg-muted/30 lg:col-span-2" />
        <div className="h-80 animate-pulse rounded-xl border bg-muted/30" />
      </div>
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
      <Loader2 className="mr-2 size-4 animate-spin" />
      Loading your schedule…
    </div>
  );
}

/* ===================== Helpers ===================== */

function pickNextSlot(schedule?: LoadSheddingSchedule) {
  if (!schedule?.slots?.length) return undefined;
  const now = Date.now();
  const upcoming = schedule.slots
    .map((s) => ({ slot: s, t: new Date(s.startTime).getTime() }))
    .filter((x) => x.t >= now)
    .sort((a, b) => a.t - b.t);
  return upcoming[0]?.slot ?? schedule.slots[0];
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
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
