import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import { API_ROUTES } from "@/constants/api";

import type {
  AddSlotPayload,
  AddSlotResponse,
  CreateSchedulePayload,
  CreateScheduleResponse,
  LoadSheddingSchedule,
  RejectSchedulePayload,
  ScheduleSlot,
  ScheduleStatus,
} from "./schedule.types";

export type ScheduleFilters = {
  zoneId?: string;
  status?: ScheduleStatus;
  date?: string;
};

// `GET /api/v1/load-shedding/schedules`
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

// `GET /api/v1/load-shedding/schedules/:scheduleId`
// The service includes embedded slots (with feeder) for the detail view.
export async function getScheduleById(
  scheduleId: string,
): Promise<LoadSheddingSchedule> {
  const response = await api<ApiResponse<LoadSheddingSchedule>>(
    API_ROUTES.loadShedding.scheduleById(encodeURIComponent(scheduleId)),
    { method: "GET" },
  );

  return response.data;
}

// `GET /api/v1/load-shedding/schedules/:scheduleId/slots`
export async function getScheduleSlots(
  scheduleId: string,
): Promise<ScheduleSlot[]> {
  const response = await api<ApiResponse<ScheduleSlot[]>>(
    API_ROUTES.loadShedding.scheduleSlots(encodeURIComponent(scheduleId)),
    { method: "GET" },
  );

  return response.data;
}

// `POST /api/v1/load-shedding/schedules`
export async function createSchedule(
  payload: CreateSchedulePayload,
): Promise<CreateScheduleResponse> {
  const response = await api<ApiResponse<CreateScheduleResponse>>(
    API_ROUTES.loadShedding.schedules,
    {
      method: "POST",
      body: payload,
    },
  );

  return response.data;
}

// `POST /api/v1/load-shedding/schedules/:scheduleId/slots`
export async function addSlot(
  scheduleId: string,
  payload: AddSlotPayload,
): Promise<AddSlotResponse> {
  const response = await api<ApiResponse<AddSlotResponse>>(
    API_ROUTES.loadShedding.createSlot(encodeURIComponent(scheduleId)),
    {
      method: "POST",
      body: payload,
    },
  );

  return response.data;
}

// `DELETE /api/v1/load-shedding/slots/:slotId`
export async function deleteSlot(slotId: string): Promise<void> {
  await api(API_ROUTES.loadShedding.deleteSlot(encodeURIComponent(slotId)), {
    method: "DELETE",
  });
}

// `POST /api/v1/load-shedding/schedules/:scheduleId/submit`
export async function submitSchedule(
  scheduleId: string,
): Promise<LoadSheddingSchedule> {
  const response = await api<ApiResponse<LoadSheddingSchedule>>(
    API_ROUTES.loadShedding.submit(encodeURIComponent(scheduleId)),
    { method: "POST" },
  );

  return response.data;
}

// `POST /api/v1/load-shedding/schedules/:scheduleId/approve`
export async function approveSchedule(
  scheduleId: string,
): Promise<LoadSheddingSchedule> {
  const response = await api<ApiResponse<LoadSheddingSchedule>>(
    API_ROUTES.loadShedding.approve(encodeURIComponent(scheduleId)),
    { method: "POST" },
  );

  return response.data;
}

// `POST /api/v1/load-shedding/schedules/:scheduleId/reject`
// The current service takes no body, but we keep a typed reason
// field so a future backend change is non-breaking for the caller.
export async function rejectSchedule(
  scheduleId: string,
  payload?: RejectSchedulePayload,
): Promise<LoadSheddingSchedule> {
  const response = await api<ApiResponse<LoadSheddingSchedule>>(
    API_ROUTES.loadShedding.reject(encodeURIComponent(scheduleId)),
    {
      method: "POST",
      body: payload ?? {},
    },
  );

  return response.data;
}

// `POST /api/v1/load-shedding/schedules/:scheduleId/activate`
export async function activateSchedule(
  scheduleId: string,
): Promise<LoadSheddingSchedule> {
  const response = await api<ApiResponse<LoadSheddingSchedule>>(
    API_ROUTES.loadShedding.activate(encodeURIComponent(scheduleId)),
    { method: "POST" },
  );

  return response.data;
}

// `GET /api/v1/load-shedding/my-schedule` (CUSTOMER)
export async function getMySchedule(): Promise<LoadSheddingSchedule[]> {
  const response = await api<ApiResponse<LoadSheddingSchedule[]>>(
    API_ROUTES.loadShedding.mySchedule,
    { method: "GET" },
  );

  return response.data;
}
