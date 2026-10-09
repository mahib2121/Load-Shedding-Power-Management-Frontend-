"use client";

import { useMemo, useState } from "react";
import {
  CreditCard,
  ReceiptText,
  Search,
  RefreshCw,
  CircleCheck,
  Clock3,
  CircleX,
  ArrowUpRight,
} from "lucide-react";

import { useMyPayments } from "../../_features/payments/payment.hook";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "CANCELLED";

type PaymentItem = {
  id: string;
  amount: number | string;
  currency: string;
  status: PaymentStatus | string;
  transactionId?: string | null;
  createdAt: string;
  updatedAt?: string;
  outageReport?: {
    id: string;
    description?: string | null;
    area?: {
      name: string;
      code?: string;
    } | null;
    feeder?: {
      name: string;
      code?: string;
    } | null;
    outageId?: string | null;
  } | null;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatAmount(amount: number | string, currency: string) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return `${amount} ${currency}`;
  }

  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currency || "BDT",
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${numericAmount.toFixed(2)} ${currency}`;
  }
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  const styles: Record<string, string> = {
    PAID: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
    PENDING:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    FAILED: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
    CANCELLED: "border-muted-foreground/30 bg-muted text-muted-foreground",
  };

  const Icon =
    normalized === "PAID"
      ? CircleCheck
      : normalized === "PENDING"
        ? Clock3
        : normalized === "FAILED" || normalized === "CANCELLED"
          ? CircleX
          : ReceiptText;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[normalized] ?? "border-border bg-muted text-muted-foreground"
      }`}
    >
      <Icon className="size-3.5" />
      {normalized.replaceAll("_", " ")}
    </span>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof CreditCard;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-lg border bg-muted/40 p-2.5">
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyPayments();

  // Supports the standard API envelope: { data: Payment[] }.
  const payments = (response?.data ?? []) as PaymentItem[];

  const filteredPayments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesStatus =
        statusFilter === "ALL" || payment.status.toUpperCase() === statusFilter;

      const searchableText = [
        payment.id,
        payment.transactionId ?? "",
        payment.outageReport?.id ?? "",
        payment.outageReport?.description ?? "",
        payment.outageReport?.area?.name ?? "",
        payment.outageReport?.feeder?.name ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        (!normalizedSearch || searchableText.includes(normalizedSearch))
      );
    });
  }, [payments, search, statusFilter]);

  const totalPaid = payments
    .filter((payment) => payment.status.toUpperCase() === "PAID")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const pendingCount = payments.filter(
    (payment) => payment.status.toUpperCase() === "PENDING",
  ).length;

  const paidCurrency =
    payments.find((payment) => payment.status.toUpperCase() === "PAID")
      ?.currency ?? "BDT";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View your outage-report payments and transaction details.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Total payments"
          value={String(payments.length)}
          description="All recorded transactions"
          icon={ReceiptText}
        />
        <SummaryCard
          title="Total paid"
          value={formatAmount(totalPaid, paidCurrency)}
          description="Successfully completed payments"
          icon={CircleCheck}
        />
        <SummaryCard
          title="Pending payments"
          value={String(pendingCount)}
          description="Awaiting payment confirmation"
          icon={Clock3}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Search and filter your payment history.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search payment, transaction, area..."
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                if (value !== null) {
                  setStatusFilter(value);
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-14 animate-pulse rounded-md bg-muted"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-destructive/30 p-6 text-center">
              <p className="font-medium">Could not load payment history</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred."}
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => refetch()}
              >
                Try again
              </Button>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center">
              <div className="rounded-full bg-muted p-3">
                <CreditCard className="size-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">
                {payments.length === 0
                  ? "No payments yet"
                  : "No matching payments"}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {payments.length === 0
                  ? "Your outage-report payments will appear here when you submit a report."
                  : "Try changing your search or status filter."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto rounded-md border md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Outage report</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="min-w-40">
                          <span className="text-sm">
                            {formatDate(payment.createdAt)}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className="font-mono text-xs">
                            {payment.id}
                          </span>
                        </TableCell>

                        <TableCell className="min-w-40">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {payment.outageReport?.area?.name ??
                                "Outage report"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {payment.outageReport?.description ||
                                payment.outageReport?.id ||
                                "No description"}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="font-mono text-xs">
                            {payment.transactionId || "—"}
                          </span>
                        </TableCell>

                        <TableCell>
                          <StatusBadge status={payment.status} />
                        </TableCell>

                        <TableCell className="text-right font-semibold">
                          {formatAmount(payment.amount, payment.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 md:hidden">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="space-y-3 rounded-lg border p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold">
                          {formatAmount(payment.amount, payment.currency)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(payment.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={payment.status} />
                    </div>

                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">Payment ID</p>
                      <p className="break-all font-mono text-xs">
                        {payment.id}
                      </p>
                    </div>

                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">Outage report</p>
                      <p>
                        {payment.outageReport?.area?.name ??
                          payment.outageReport?.id ??
                          "—"}
                      </p>
                      {payment.outageReport?.description && (
                        <p className="text-xs text-muted-foreground">
                          {payment.outageReport.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">Transaction ID</p>
                      <p className="break-all font-mono text-xs">
                        {payment.transactionId || "Not available"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!isLoading && !isError && filteredPayments.length > 0 && (
            <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {filteredPayments.length} of {payments.length} payments
              </p>
              <p>Sorted by newest first</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
