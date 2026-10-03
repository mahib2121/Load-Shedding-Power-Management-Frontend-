import { api } from "@/lib/api/client";

import type { ApiResponse } from "@/lib/api/types";
import type { LoadSheddingSchedule, ScheduleStatus } from "./schedule.types";

import { API_ROUTES } from "@/constants/api";

export type ScheduleFilters = {
  zoneId?: string;
  status?: ScheduleStatus;
  date?: string;
};

export async function getSchedules(
  filters?: ScheduleFilters,
): Promise<LoadSheddingSchedule[]> {
  const searchParams = new URLSearchParams();

  if (filters?.zoneId) {
    searchParams.set("zoneId", filters.zoneId);
  }

  if (filters?.status) {
    searchParams.set("status", filters.status);
  }

  if (filters?.date) {
    searchParams.set("date", filters.date);
  }

  const query = searchParams.toString();

  const url = query
    ? `${API_ROUTES.loadShedding.schedules}?${query}`
    : API_ROUTES.loadShedding.schedules;

  const response = await api<ApiResponse<LoadSheddingSchedule[]>>(url, {
    method: "GET",
  });

  return response.data;
}

export async function getMySchedule(): Promise<LoadSheddingSchedule[]> {
  const response = await api<ApiResponse<LoadSheddingSchedule[]>>(
    API_ROUTES.loadShedding.mySchedule,
    {
      method: "GET",
    },
  );

  return response.data;
}
