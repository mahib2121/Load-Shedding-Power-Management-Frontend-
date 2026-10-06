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
