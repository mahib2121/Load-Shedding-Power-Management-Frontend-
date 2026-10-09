import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createOutageReport,
  getMyOutageReports,
  getOperationalOutages,
} from "./outage.api";

export const OUTAGE_QUERY_KEYS = {
  all: ["outages"] as const,
  myReports: () => [...OUTAGE_QUERY_KEYS.all, "my-reports"] as const,
  operations: (status?: string) =>
    [...OUTAGE_QUERY_KEYS.all, "operations", status ?? "ALL"] as const,
};

export function useCreateOutageReport() {
  return useMutation({
    mutationFn: createOutageReport,
  });
}

export function useMyOutageReports() {
  return useQuery({
    queryKey: OUTAGE_QUERY_KEYS.myReports(),
    queryFn: getMyOutageReports,
    retry: 1,
  });
}
export function useOperationalOutages(status?: string) {
  return useQuery({
    queryKey: OUTAGE_QUERY_KEYS.operations(status),
    queryFn: () => getOperationalOutages(status),
    retry: 1,
  });
}
