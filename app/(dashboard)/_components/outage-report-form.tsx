"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { MapPin, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCreateOutageReport } from "../_features/outages/outage.hook";
import { createOutageReportSchema } from "../_features/outages/outage.schema";
import { useInitializePayment } from "../_features/payments/payment.hook";

export function OutageReportForm() {
  const router = useRouter();

  const createReport = useCreateOutageReport();
  const initializePayment = useInitializePayment();

  const isSubmitting = createReport.isPending || initializePayment.isPending;

  const form = useForm({
    defaultValues: {
      description: "",
      latitude: undefined as number | undefined,
      longitude: undefined as number | undefined,
    },

    validators: {
      onSubmit: createOutageReportSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        // 1. Create outage report
        const response = await createReport.mutateAsync({
          description: value.description.trim() || undefined,
          latitude: value.latitude,
          longitude: value.longitude,
        });

        const paymentId = response.data.payment.id;

        if (!paymentId) {
          throw new Error(
            "Payment information was not returned for this outage report.",
          );
        }

        toast.success("Outage report created successfully.");

        // 2. Initialize SSLCommerz payment
        const paymentResponse = await initializePayment.mutateAsync(paymentId);

        const gatewayUrl =
          paymentResponse.data.GatewayPageURL ??
          paymentResponse.data.gatewayPageURL;

        if (!gatewayUrl) {
          throw new Error("Payment gateway URL was not returned.");
        }

        // 3. Redirect customer to SSLCommerz
        window.location.href = gatewayUrl;
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to submit outage report.",
        );
      }
    },
  });

  function getLocation() {
    if (!navigator.geolocation) {
      toast.error("Location is not supported by your browser.");

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setFieldValue("latitude", position.coords.latitude);

        form.setFieldValue("longitude", position.coords.longitude);

        toast.success("Location added successfully.");
      },
      () => {
        toast.error(
          "Unable to get your location. You can continue without it.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report a power outage</CardTitle>

        <p className="text-sm text-muted-foreground">
          Tell us about the outage in your area. Your report will be reviewed by
          the power operations team.
        </p>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Description */}
          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>

                <Textarea
                  id="description"
                  placeholder="Describe the outage, such as when it started or what you noticed..."
                  rows={5}
                  maxLength={1000}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  disabled={isSubmitting}
                />

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Optional. Maximum 1000 characters.
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {field.state.value.length}/1000
                  </p>
                </div>

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Location */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" />

                  <p className="text-sm font-medium">Outage location</p>
                </div>

                <p className="mt-1 max-w-xl text-xs text-muted-foreground">
                  Your assigned area is automatically used for the outage
                  report. You can optionally provide your current coordinates.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={getLocation}
                disabled={isSubmitting}
              >
                <MapPin className="mr-2 size-4" />
                Use my location
              </Button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <form.Field name="latitude">
                {(field) => (
                  <div className="rounded-md border bg-background p-3">
                    <Label className="text-xs">Latitude</Label>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {field.state.value !== undefined
                        ? field.state.value.toFixed(6)
                        : "Not provided"}
                    </p>
                  </div>
                )}
              </form.Field>

              <form.Field name="longitude">
                {(field) => (
                  <div className="rounded-md border bg-background p-3">
                    <Label className="text-xs">Longitude</Label>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {field.state.value !== undefined
                        ? field.state.value.toFixed(6)
                        : "Not provided"}
                    </p>
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Service fee */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Outage report service fee</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Payment is required before the outage is sent to the
                  operations team.
                </p>
              </div>

              <p className="shrink-0 text-lg font-bold">৳100</p>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Send className="mr-2 size-4" />

            {createReport.isPending
              ? "Creating report..."
              : initializePayment.isPending
                ? "Opening payment..."
                : "Submit & Pay ৳100"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
