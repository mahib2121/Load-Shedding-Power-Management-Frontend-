import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import { API_ROUTES } from "@/constants/api";
import type { MyOutageReport } from "./outage.types";
import type {
  CreateOutageReportPayload,
  CreateOutageReportResponse,
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
