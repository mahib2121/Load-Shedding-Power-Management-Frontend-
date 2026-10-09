import { useMutation, useQuery } from "@tanstack/react-query";

import { initializePayment, getMyPayments } from "./payment.api";

export const PAYMENT_QUERY_KEYS = {
  all: ["payments"] as const,
  myPayments: () => [...PAYMENT_QUERY_KEYS.all, "my-payments"] as const,
};

export function useInitializePayment() {
  return useMutation({
    mutationFn: initializePayment,
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.myPayments(),
    queryFn: getMyPayments,
    retry: false,
  });
}
