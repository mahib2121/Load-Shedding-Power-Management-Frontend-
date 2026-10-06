import { useMutation } from "@tanstack/react-query";

import { initializePayment } from "./payment.api";

export const PAYMENT_QUERY_KEYS = {
  all: ["payments"] as const,
};

export function useInitializePayment() {
  return useMutation({
    mutationFn: initializePayment,
  });
}
