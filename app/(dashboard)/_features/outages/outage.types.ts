export type CreateOutageReportPayload = {
  description?: string;
  latitude?: number;
  longitude?: number;
};

export type OutageReport = {
  id: string;
  userId: string;
  areaId: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type OutagePayment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  userId: string;
  outageReportId: string;
  createdAt: string;
  updatedAt: string;
};

export type OutageArea = {
  id: string;
  name: string;
  code: string;
};

export type CreateOutageReportResponse = {
  report: OutageReport;
  payment: OutagePayment;
  area: OutageArea;
  serviceFee: number;
  currency: string;
};

export type MyOutageReportPayment = {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | string;
  createdAt?: string;
};

export type MyOutageReportArea = {
  id: string;
  name: string;
  code?: string;
};

export type MyOutageReportFeeder = {
  id: string;
  name: string;
  code?: string;
};

export type MyOutageReportOutage = {
  id: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  startedAt?: string | null;
  restoredAt?: string | null;
};

export type MyOutageReport = {
  id: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt?: string;
  area?: MyOutageReportArea | null;
  feeder?: MyOutageReportFeeder | null;
  payment?: MyOutageReportPayment | null;
  outage?: MyOutageReportOutage | null;
};
