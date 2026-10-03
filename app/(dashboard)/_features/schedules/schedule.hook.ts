"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/app/(auth)/_features/auth.provider";

import {
  getMySchedule,
  getSchedules,
  type ScheduleFilters,
} from "./schedule.api";

export const scheduleKeys = {
  all: ["load-shedding"] as const,

  schedules: (filters?: ScheduleFilters) =>
    [...scheduleKeys.all, "schedules", filters] as const,

  mySchedule: () => [...scheduleKeys.all, "my-schedule"] as const,
};

export function useSchedules(filters?: ScheduleFilters) {
  const { user } = useAuth();

  return useQuery({
    queryKey: scheduleKeys.schedules(filters),

    queryFn: () => getSchedules(filters),

    enabled:
      !!user && (user.role === "SUPER_ADMIN" || user.role === "ZONE_MANAGER"),

    retry: false,
  });
}

export function useMySchedule() {
  const { user } = useAuth();

  return useQuery({
    queryKey: scheduleKeys.mySchedule(),

    queryFn: getMySchedule,

    enabled: !!user && user.role === "CUSTOMER",

    retry: false,
  });
}
