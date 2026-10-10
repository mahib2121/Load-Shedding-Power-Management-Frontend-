"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { useAuth } from "@/app/(auth)/_features/auth.provider";

import {
  activateSchedule,
  addSlot,
  approveSchedule,
  createSchedule,
  deleteSlot,
  getMySchedule,
  getScheduleById,
  getScheduleSlots,
  getSchedules,
  rejectSchedule,
  submitSchedule,
  type ScheduleFilters,
} from "./schedule.api";

import type {
  LoadSheddingSchedule,
  ScheduleSlot,
} from "./schedule.types";

export const scheduleKeys = {
  all: ["load-shedding"] as const,

  schedules: (filters?: ScheduleFilters) =>
    [...scheduleKeys.all, "schedules", filters] as const,

  detail: (scheduleId: string) =>
    [...scheduleKeys.all, "schedule", scheduleId] as const,

  slots: (scheduleId: string) =>
    [...scheduleKeys.all, "schedule", scheduleId, "slots"] as const,

  mySchedule: () => [...scheduleKeys.all, "my-schedule"] as const,
};

// ZONE_MANAGER and SUPER_ADMIN list schedules.
export function useSchedules(
  filters?: ScheduleFilters,
  options?: Pick<UseQueryOptions<LoadSheddingSchedule[]>, "enabled">,
) {
  const { user } = useAuth();

  const roleAllowed =
    !!user && (user.role === "SUPER_ADMIN" || user.role === "ZONE_MANAGER");

  return useQuery({
    queryKey: scheduleKeys.schedules(filters),
    queryFn: () => getSchedules(filters),
    enabled: options?.enabled ?? roleAllowed,
    retry: false,
  });
}

// Customer-facing schedule (only CUSTOMER).
export function useMySchedule(
  options?: Pick<UseQueryOptions<LoadSheddingSchedule[]>, "enabled">,
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: scheduleKeys.mySchedule(),
    queryFn: getMySchedule,
    enabled: options?.enabled ?? (!!user && user.role === "CUSTOMER"),
    retry: false,
  });
}

// Manager detail (SUPER_ADMIN/ZONE_MANAGER). The service embeds slots.
export function useScheduleDetail(
  scheduleId: string,
  options?: Pick<UseQueryOptions<LoadSheddingSchedule>, "enabled">,
) {
  const { user } = useAuth();

  const roleAllowed =
    !!user && (user.role === "SUPER_ADMIN" || user.role === "ZONE_MANAGER");

  return useQuery({
    queryKey: scheduleKeys.detail(scheduleId),
    queryFn: () => getScheduleById(scheduleId),
    enabled: options?.enabled ?? (!!scheduleId && roleAllowed),
    retry: false,
  });
}

// Explicit slots query — useful for pages that want a separate refetch.
export function useScheduleSlots(
  scheduleId: string,
  options?: Pick<UseQueryOptions<ScheduleSlot[]>, "enabled">,
) {
  const { user } = useAuth();

  const roleAllowed =
    !!user && (user.role === "SUPER_ADMIN" || user.role === "ZONE_MANAGER");

  return useQuery({
    queryKey: scheduleKeys.slots(scheduleId),
    queryFn: () => getScheduleSlots(scheduleId),
    enabled: options?.enabled ?? (!!scheduleId && roleAllowed),
    retry: false,
  });
}

// ---------- mutations ----------

function useInvalidateSchedules() {
  const queryClient = useQueryClient();

  return (scheduleId?: string) => {
    queryClient.invalidateQueries({ queryKey: scheduleKeys.schedules() });
    queryClient.invalidateQueries({ queryKey: scheduleKeys.mySchedule() });

    if (scheduleId) {
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.detail(scheduleId),
      });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.slots(scheduleId) });
    }
  };
}

export function useCreateSchedule() {
  const invalidate = useInvalidateSchedules();

  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => invalidate(),
  });
}

export function useAddSlot(scheduleId: string) {
  const invalidate = useInvalidateSchedules();

  return useMutation({
    mutationFn: (payload: Parameters<typeof addSlot>[1]) =>
      addSlot(scheduleId, payload),
    onSuccess: () => invalidate(scheduleId),
  });
}

export function useDeleteSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
  });
}

export function useSubmitSchedule() {
  const invalidate = useInvalidateSchedules();

  return useMutation({
    mutationFn: submitSchedule,
    onSuccess: (_data, scheduleId) => invalidate(scheduleId),
  });
}

export function useApproveSchedule() {
  const invalidate = useInvalidateSchedules();

  return useMutation({
    mutationFn: approveSchedule,
    onSuccess: (_data, scheduleId) => invalidate(scheduleId),
  });
}

export function useRejectSchedule() {
  const invalidate = useInvalidateSchedules();

  return useMutation({
    mutationFn: ({
      scheduleId,
      reason,
    }: {
      scheduleId: string;
      reason?: string;
    }) => rejectSchedule(scheduleId, reason ? { reason } : undefined),
    onSuccess: (_data, { scheduleId }) => invalidate(scheduleId),
  });
}

export function useActivateSchedule() {
  const invalidate = useInvalidateSchedules();

  return useMutation({
    mutationFn: activateSchedule,
    onSuccess: (_data, scheduleId) => invalidate(scheduleId),
  });
}
