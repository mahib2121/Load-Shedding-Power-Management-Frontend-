import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  assignTechnician,
  createOutageReport,
  getMyOutageReports,
  getOperationalOutages,
  getOutageById,
  restoreOutagePower,
  startOutageRepair,
  verifyOutage,
} from "./outage.api";

export const OUTAGE_QUERY_KEYS = {
  all: ["outages"] as const,

  myReports: () => [...OUTAGE_QUERY_KEYS.all, "my-reports"] as const,

  operations: (status?: string) =>
    [...OUTAGE_QUERY_KEYS.all, "operations", status ?? "ALL"] as const,

  detail: (outageId: string) =>
    [...OUTAGE_QUERY_KEYS.all, "detail", outageId] as const,
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

export function useOutageDetail(outageId: string) {
  return useQuery({
    queryKey: OUTAGE_QUERY_KEYS.detail(outageId),
    queryFn: () => getOutageById(outageId),
    enabled: Boolean(outageId),
    retry: 1,
  });
}

export function useVerifyOutage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyOutage,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: OUTAGE_QUERY_KEYS.all,
      }),
  });
}

export function useAssignTechnician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      outageId,
      technicianId,
      notes,
    }: {
      outageId: string;
      technicianId: string;
      notes?: string;
    }) =>
      assignTechnician(outageId, {
        technicianId,
        ...(notes ? { notes } : {}),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: OUTAGE_QUERY_KEYS.all,
      }),
  });
}

export function useStartOutageRepair() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startOutageRepair,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: OUTAGE_QUERY_KEYS.all,
      }),
  });
}

export function useRestoreOutagePower() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreOutagePower,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: OUTAGE_QUERY_KEYS.all,
      }),
  });
}
