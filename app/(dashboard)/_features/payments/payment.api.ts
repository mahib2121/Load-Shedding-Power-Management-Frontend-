import { api } from "@/lib/api/client";

import type { ApiResponse } from "@/lib/api/types";

import type { InitializePaymentResponse } from "./payment.types";
import { API_ROUTES } from "@/constants/api";

export async function initializePayment(
  paymentId: string,
): Promise<ApiResponse<InitializePaymentResponse>> {
  return api<ApiResponse<InitializePaymentResponse>>(
    API_ROUTES.payments.initialize(paymentId),
    {
      method: "POST",
    },
  );
}
