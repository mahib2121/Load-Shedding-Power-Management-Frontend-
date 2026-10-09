import { useMutation, useQuery } from "@tanstack/react-query";

import { createOutageReport, getMyOutageReports } from "./outage.api";

export const OUTAGE_QUERY_KEYS = {
  all: ["outages"] as const,
  myReports: () => [...OUTAGE_QUERY_KEYS.all, "my-reports"] as const,
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
