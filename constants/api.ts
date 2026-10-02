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

  schedules: {
    base: `${API_PREFIX}/load-shedding/schedules`,
  },

  outages: {
    base: `${API_PREFIX}/outages`,
  },

  payments: {
    base: `${API_PREFIX}/payments`,
  },
} as const;
