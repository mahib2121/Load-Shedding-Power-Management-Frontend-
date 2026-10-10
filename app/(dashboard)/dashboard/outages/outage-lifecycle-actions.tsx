"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/app/(auth)/_features/auth.provider";

import {
  useVerifyOutage,
  useAssignTechnician,
  useStartOutageRepair,
  useRestoreOutagePower,
} from "../../_features/outages/outage.hook";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  outageId: string;
  status: string;
};

export function OutageLifecycleActions({ outageId, status }: Props) {
  const { user } = useAuth();
  const [notes, setNotes] = useState("");

  const verifyMutation = useVerifyOutage();
  const assignMutation = useAssignTechnician();
  const startMutation = useStartOutageRepair();
  const restoreMutation = useRestoreOutagePower();

  const role = user?.role;
  const canManage = role === "FIELD_OPERATOR" || role === "ZONE_MANAGER";

  const normalizedStatus = status.toUpperCase();

  if (!canManage) return null;

  async function handleVerify() {
    try {
      await verifyMutation.mutateAsync(outageId);
      toast.success("Outage verified successfully");
    } catch {
      toast.error("Could not verify outage");
    }
  }

  async function handleAssign() {
    const technicianId = process.env.NEXT_PUBLIC_DEFAULT_TECHNICIAN_ID?.trim();

    if (!technicianId) {
      toast.error(
        "Configure NEXT_PUBLIC_DEFAULT_TECHNICIAN_ID in .env.local first",
      );
      return;
    }

    try {
      await assignMutation.mutateAsync({
        outageId,
        technicianId,
        notes: notes.trim() || undefined,
      });

      setNotes("");
      toast.success("Technician assigned successfully");
    } catch {
      toast.error("Could not assign technician");
    }
  }

  async function handleStart() {
    try {
      await startMutation.mutateAsync(outageId);
      toast.success("Repair started");
    } catch {
      toast.error("Could not start repair");
    }
  }

  async function handleRestore() {
    try {
      await restoreMutation.mutateAsync(outageId);
      toast.success("Power restoration recorded");
    } catch {
      toast.error("Could not restore outage");
    }
  }

  const isBusy =
    verifyMutation.isPending ||
    assignMutation.isPending ||
    startMutation.isPending ||
    restoreMutation.isPending;

  const hasDefaultTechnician = Boolean(
    process.env.NEXT_PUBLIC_DEFAULT_TECHNICIAN_ID?.trim(),
  );

  const actionAvailable =
    normalizedStatus === "REPORTED" ||
    normalizedStatus === "VERIFIED" ||
    normalizedStatus === "ASSIGNED" ||
    normalizedStatus === "IN_PROGRESS";

  if (!actionAvailable) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Outage actions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {normalizedStatus === "REPORTED" && (
          <Button
            className="w-full sm:w-auto"
            onClick={handleVerify}
            disabled={isBusy}
          >
            {verifyMutation.isPending ? "Verifying..." : "Verify outage"}
          </Button>
        )}

        {normalizedStatus === "VERIFIED" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Assign this outage to the configured default technician.
            </p>

            <Input
              placeholder="Assignment notes (optional)"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              disabled={isBusy}
              maxLength={1000}
            />

            <Button
              className="w-full sm:w-auto"
              onClick={handleAssign}
              disabled={isBusy || !hasDefaultTechnician}
            >
              {assignMutation.isPending ? "Assigning..." : "Assign technician"}
            </Button>

            {!hasDefaultTechnician && (
              <p className="text-sm text-destructive">
                Set NEXT_PUBLIC_DEFAULT_TECHNICIAN_ID in .env.local.
              </p>
            )}
          </div>
        )}

        {normalizedStatus === "ASSIGNED" && (
          <Button
            className="w-full sm:w-auto"
            onClick={handleStart}
            disabled={isBusy}
          >
            {startMutation.isPending ? "Starting..." : "Start repair"}
          </Button>
        )}

        {normalizedStatus === "IN_PROGRESS" && (
          <Button
            className="w-full sm:w-auto"
            onClick={handleRestore}
            disabled={isBusy}
          >
            {restoreMutation.isPending
              ? "Recording restoration..."
              : "Restore power"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
