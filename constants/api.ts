export const API_PREFIX = "/api/v1";

export const API_ROUTES = {
  auth: {
    register: `${API_PREFIX}/auth/register`,
    login: `${API_PREFIX}/auth/login`,
    google: `${API_PREFIX}/auth/google`,
    refreshToken: `${API_PREFIX}/auth/refresh-token`,
    logout: `${API_PREFIX}/auth/logout`,
    forgotPassword: `${API_PREFIX}/auth/forgot-password`,
    resetPassword: `${API_PREFIX}/auth/reset-password`,
    me: `${API_PREFIX}/auth/me`,
  },

  loadShedding: {
    schedules: `${API_PREFIX}/load-shedding/schedules`,

    mySchedule: `${API_PREFIX}/load-shedding/my-schedule`,

    scheduleById: (scheduleId: string) =>
      `${API_PREFIX}/load-shedding/schedules/${scheduleId}`,

    scheduleSlots: (scheduleId: string) =>
      `${API_PREFIX}/load-shedding/schedules/${scheduleId}/slots`,

    createSlot: (scheduleId: string) =>
      `${API_PREFIX}/load-shedding/schedules/${scheduleId}/slots`,

    deleteSlot: (slotId: string) =>
      `${API_PREFIX}/load-shedding/slots/${slotId}`,

    submit: (scheduleId: string) =>
      `${API_PREFIX}/load-shedding/schedules/${scheduleId}/submit`,

    approve: (scheduleId: string) =>
      `${API_PREFIX}/load-shedding/schedules/${scheduleId}/approve`,

    reject: (scheduleId: string) =>
      `${API_PREFIX}/load-shedding/schedules/${scheduleId}/reject`,

    activate: (scheduleId: string) =>
      `${API_PREFIX}/load-shedding/schedules/${scheduleId}/activate`,
  },
  outages: {
    base: `${API_PREFIX}/outages`,

    reports: `${API_PREFIX}/outages/reports`,

    verify: (outageId: string) => `${API_PREFIX}/outages/${outageId}/verify`,

    assign: (outageId: string) => `${API_PREFIX}/outages/${outageId}/assign`,

    start: (outageId: string) => `${API_PREFIX}/outages/${outageId}/start`,

    restore: (outageId: string) => `${API_PREFIX}/outages/${outageId}/restore`,
  },

  payments: {
    base: `${API_PREFIX}/payments`,
  },
} as const;
