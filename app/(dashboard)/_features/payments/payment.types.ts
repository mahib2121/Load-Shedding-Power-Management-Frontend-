export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export type PaymentArea = {
  id: string;
  name: string;
  code?: string;
};

export type PaymentFeeder = {
  id: string;
  name: string;
  code?: string;
};

export type PaymentOutageReport = {
  id: string;
  description?: string | null;
  areaId?: string;
  outageId?: string | null;
  createdAt?: string;
  area?: PaymentArea | null;
  feeder?: PaymentFeeder | null;
};

export type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  userId: string;
  outageReportId: string;
  transactionId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  outageReport?: PaymentOutageReport | null;
};

export type InitializePaymentResponse = {
  GatewayPageURL?: string;
  gatewayPageURL?: string;
  status?: string;
  failedreason?: string;
  sessionkey?: string;
  tran_date?: string;
  tran_id?: string;
  amount?: string;
  currency?: string;
  [key: string]: unknown;
};
