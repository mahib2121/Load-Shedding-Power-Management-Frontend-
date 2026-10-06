export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

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
};

export type PaymentInitializationResponse = {
  GatewayPageURL?: string;
  gatewayPageURL?: string;
  status?: string;
  sessionkey?: string;
  [key: string]: unknown;
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
