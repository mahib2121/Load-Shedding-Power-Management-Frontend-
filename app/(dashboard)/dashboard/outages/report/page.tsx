import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

import { OutageReportForm } from "@/app/(dashboard)/_components/outage-report-form";

export default function ReportOutagePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" className="-ml-2">
          <Link href="/dashboard/outages">
            <ArrowLeft className="mr-2 size-4" />
            Back to outages
          </Link>
        </Button>

        <div className="mt-4 flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <TriangleAlert className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Report an outage
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Report a power outage in your area so our team can investigate and
              restore service.
            </p>
          </div>
        </div>
      </div>

      <OutageReportForm />
    </div>
  );
}
