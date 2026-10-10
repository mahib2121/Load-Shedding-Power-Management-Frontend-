import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import { API_ROUTES } from "@/constants/api";

import type {
  CreateOutageReportPayload,
  CreateOutageReportResponse,
  MyOutageReport,
  OperationalOutage,
  OutageDetail,
} from "./outage.types";

export async function createOutageReport(
  payload: CreateOutageReportPayload,
): Promise<ApiResponse<CreateOutageReportResponse>> {
  return api<ApiResponse<CreateOutageReportResponse>>(
    API_ROUTES.outages.reports,
    {
      method: "POST",
      body: payload,
    },
  );
}

export async function getMyOutageReports(): Promise<
  ApiResponse<MyOutageReport[]>
> {
  return api<ApiResponse<MyOutageReport[]>>(API_ROUTES.outages.myReports, {
    method: "GET",
  });
}
export async function getOperationalOutages(
  status?: string,
): Promise<ApiResponse<OperationalOutage[]>> {
  return api<ApiResponse<OperationalOutage[]>>(API_ROUTES.outages.list, {
    method: "GET",
    query: status ? { status } : undefined,
  });
}

export type AssignTechnicianPayload = {
  technicianId: string;
  notes?: string;
};

export async function verifyOutage(outageId: string) {
  return api(API_ROUTES.outages.verify(outageId), {
    method: "PATCH",
  });
}

export async function assignTechnician(
  outageId: string,
  payload: AssignTechnicianPayload,
) {
  return api(API_ROUTES.outages.assign(outageId), {
    method: "POST",
    body: payload,
  });
}

export async function startOutageRepair(outageId: string) {
  return api(API_ROUTES.outages.start(outageId), {
    method: "PATCH",
  });
}

export async function restoreOutagePower(outageId: string) {
  return api(API_ROUTES.outages.restore(outageId), {
    method: "PATCH",
  });
}

export async function getOutageById(
  outageId: string,
): Promise<ApiResponse<OutageDetail>> {
  return api<ApiResponse<OutageDetail>>(
    `${API_ROUTES.outages.base}/${encodeURIComponent(outageId)}`,
    { method: "GET" },
  );
}
