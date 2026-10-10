"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Loader2,
  Send,
} from "lucide-react";
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { useAuth } from "@/app/(auth)/_features/auth.provider";
import { useCreateSchedule } from "@/app/(dashboard)/_features/schedules/schedule.hook";
import { createScheduleSchema } from "@/app/(dashboard)/_features/schedules/schedule.schema";

function parsePositiveNumber(value: string) {
  if (!value) return undefined;

  const parsed = Number(value);

  if (Number.isNaN(parsed)) return undefined;

  return parsed;
}

export default function CreateSchedulePage() {
  const router = useRouter();
  const { user } = useAuth();

  const create = useCreateSchedule();

  const initialZoneId =
    user?.role === "ZONE_MANAGER" && user.zoneId ? user.zoneId : "";

  const form = useForm({
    defaultValues: {
      name: "",
      date: "",
      zoneId: initialZoneId,
      expectedDemandMW: "" as unknown as number,
      availableSupplyMW: "" as unknown as number,
    },

    validators: {
      onSubmit: createScheduleSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        const created = await create.mutateAsync({
          name: value.name.trim(),
          date: value.date,
          zoneId: value.zoneId.trim(),
          expectedDemandMW: Number(value.expectedDemandMW),
          availableSupplyMW: Number(value.availableSupplyMW),
        });

        toast.success("Schedule created successfully");

        if (created?.id) {
          router.push(`/dashboard/schedules/${created.id}`);
        } else {
          router.push("/dashboard/schedules");
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create schedule",
        );
      }
    },
  });

  const isPending = create.isPending;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/schedules">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 size-4" />
            Back to schedules
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            New schedule
          </div>

          <CardTitle>Create load-shedding schedule</CardTitle>

          <CardDescription>
            Schedules start in <strong>Draft</strong>. You can add slots and
            submit for approval afterwards.
          </CardDescription>
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
            <FieldGroup>
              {/* Name */}
              <form.Field name="name">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="schedule-name">Name</FieldLabel>

                    <Input
                      id="schedule-name"
                      name={field.name}
                      placeholder="e.g. Weekday morning reduction"
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
                      <FieldDescription>
                        A short human-readable label for this schedule.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              </form.Field>

              {/* Date + zone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="date">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="schedule-date">Date</FieldLabel>

                      <Input
                        id="schedule-date"
                        name={field.name}
                        type="date"
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

                <form.Field name="zoneId">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="schedule-zone">Zone ID</FieldLabel>

                      <Input
                        id="schedule-zone"
                        name={field.name}
                        placeholder="Zone UUID"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        disabled={isPending || (user?.role === "ZONE_MANAGER" && Boolean(initialZoneId))}
                      />

                      {field.state.meta.errors.length > 0 ? (
                        <FieldError>
                          {field.state.meta.errors.map((error) => (
                            <div key={error?.message}>{error?.message}</div>
                          ))}
                        </FieldError>
                      ) : (
                        <FieldDescription>
                          {user?.role === "ZONE_MANAGER"
                            ? "Locked to your assigned zone."
                            : "Enter the UUID of the zone this schedule applies to."}
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                </form.Field>
              </div>

              {/* MW inputs */}
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="expectedDemandMW">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="expected-demand">
                        Expected demand (MW)
                      </FieldLabel>

                      <Input
                        id="expected-demand"
                        name={field.name}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        placeholder="e.g. 250"
                        value={
                          field.state.value === undefined ||
                          (field.state.value as unknown) === ""
                            ? ""
                            : String(field.state.value)
                        }
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(
                            parsePositiveNumber(event.target.value) as never,
                          )
                        }
                        disabled={isPending}
                      />

                      {field.state.meta.errors.length > 0 ? (
                        <FieldError>
                          {field.state.meta.errors.map((error) => (
                            <div key={error?.message}>{error?.message}</div>
                          ))}
                        </FieldError>
                      ) : (
                        <FieldDescription>
                          Total expected demand for the day.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                </form.Field>

                <form.Field name="availableSupplyMW">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="available-supply">
                        Available supply (MW)
                      </FieldLabel>

                      <Input
                        id="available-supply"
                        name={field.name}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        placeholder="e.g. 180"
                        value={
                          field.state.value === undefined ||
                          (field.state.value as unknown) === ""
                            ? ""
                            : String(field.state.value)
                        }
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(
                            parsePositiveNumber(event.target.value) as never,
                          )
                        }
                        disabled={isPending}
                      />

                      {field.state.meta.errors.length > 0 ? (
                        <FieldError>
                          {field.state.meta.errors.map((error) => (
                            <div key={error?.message}>{error?.message}</div>
                          ))}
                        </FieldError>
                      ) : (
                        <FieldDescription>
                          Required reduction is computed server-side.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                </form.Field>
              </div>
            </FieldGroup>

            {create.isError && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />

                <p>
                  {create.error instanceof Error
                    ? create.error.message
                    : "Failed to create schedule"}
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/schedules")}
                disabled={isPending}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Send className="mr-2 size-4" />
                )}
                Create schedule
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
