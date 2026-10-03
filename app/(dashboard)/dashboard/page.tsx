"use client";

import { CalendarDays, CreditCard, TriangleAlert, Zap } from "lucide-react";

import { useAuth } from "@/app/(auth)/_features/auth.provider";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

        <p className="text-muted-foreground">
          Monitor your power management activity and load shedding information.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Current Status"
          value="Normal"
          description="Power supply status"
          icon={Zap}
        />

        <DashboardCard
          title="Upcoming"
          value="--"
          description="Next load shedding"
          icon={CalendarDays}
        />

        <DashboardCard
          title="Active Outages"
          value="--"
          description="Reported outages"
          icon={TriangleAlert}
        />

        <DashboardCard
          title="Payments"
          value="--"
          description="Payment information"
          icon={CreditCard}
        />
      </div>

      <div className="rounded-xl border bg-background p-6">
        <div className="mb-4">
          <h2 className="font-semibold">Account Information</h2>
          <p className="text-sm text-muted-foreground">
            Your current account details.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Name" value={user?.name} />
          <InfoItem label="Email" value={user?.email} />
          <InfoItem label="Role" value={user?.role?.replaceAll("_", " ")} />
          <InfoItem label="Job Type" value={user?.jobType} />
          <InfoItem label="Zone" value={user?.location?.zone?.name} />
          <InfoItem label="Area" value={user?.location?.area?.name} />
        </div>
      </div>
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

        <Icon className="size-5 text-muted-foreground" />
      </div>

      <div className="mt-3">
        <p className="text-2xl font-bold">{value}</p>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium">
        {value || "Not available"}
      </p>
    </div>
  );
}
