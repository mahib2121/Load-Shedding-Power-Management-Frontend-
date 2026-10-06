import Link from "next/link";
import { AlertTriangle, ArrowRight, MapPin, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OutagesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Power Outages</h1>
          <p className="text-muted-foreground">
            Report a power outage in your area and track the service process.
          </p>
        </div>

        <Button>
          <Link href="/dashboard/outages/report">
            <AlertTriangle className="mr-2 size-4" />
            Report an Outage
          </Link>
        </Button>
      </div>

      {/* Current status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5" />
            Outage reporting
          </CardTitle>
          <CardDescription>
            Need to report a power outage? Submit the details and provide your
            location if available.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border bg-muted/30 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-medium">
                  No outage reports displayed here yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Your assigned area is automatically associated with a new
                  outage report.
                </p>
              </div>

              <Button variant="outline">
                <Link href="/dashboard/outages/report">
                  Create Report
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
              <AlertTriangle className="size-5" />
            </div>
            <CardTitle className="text-base">1. Report</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Describe the outage and optionally share your current coordinates.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
              <ShieldCheck className="size-5" />
            </div>
            <CardTitle className="text-base">2. Pay service fee</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Complete the ৳100 outage report service payment through the
              payment gateway.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
              <MapPin className="size-5" />
            </div>
            <CardTitle className="text-base">3. Operations review</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              After successful payment, the report is sent into the power
              operations workflow.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
