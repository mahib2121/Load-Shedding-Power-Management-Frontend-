"use client";

import { useAuth } from "@/app/(auth)/_features/auth.provider";

import { CustomerOutagesView } from "./customer-outages-view";
import { OperationalOutagesView } from "./operational-outages-view";

export default function OutagesPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  switch (user?.role) {
    case "CUSTOMER":
      return <CustomerOutagesView />;

    case "FIELD_OPERATOR":
    case "ZONE_MANAGER":
    case "SUPER_ADMIN":
      return <OperationalOutagesView />;

    default:
      return (
        <div className="rounded-lg border p-6">
          <h1 className="font-semibold">Access unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account does not have access to this page.
          </p>
        </div>
      );
  }
}
