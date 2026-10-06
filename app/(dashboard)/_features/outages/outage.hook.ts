import { useMutation } from "@tanstack/react-query";

import { createOutageReport } from "./outage.api";

export const OUTAGE_QUERY_KEYS = {
  all: ["outages"] as const,
};

export function useCreateOutageReport() {
  return useMutation({
    mutationFn: createOutageReport,
  });
}
