import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";

import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
} from "./auth.schima";

import type { AuthTokens, User } from "./auth.types";

import { API_ROUTES } from "@/constants/api";

export async function login(payload: LoginFormValues) {
  return api<ApiResponse<AuthTokens>>(API_ROUTES.auth.login, {
    method: "POST",
    body: payload,
  });
}

export async function register(payload: RegisterFormValues) {
  return api<ApiResponse<AuthTokens>>(API_ROUTES.auth.register, {
    method: "POST",
    body: payload,
  });
}

export async function getMe() {
  try {
    return await api<ApiResponse<User>>(API_ROUTES.auth.me);
  } catch (error) {
    // Access token may have expired.
    // Try refreshing the session once.
    await refreshToken();

    return api<ApiResponse<User>>(API_ROUTES.auth.me);
  }
}

export async function refreshToken() {
  return api<ApiResponse<AuthTokens>>(API_ROUTES.auth.refreshToken, {
    method: "POST",
  });
}

export async function logout() {
  return api<ApiResponse<null>>(API_ROUTES.auth.logout, {
    method: "POST",
  });
}

export async function forgotPassword(payload: ForgotPasswordFormValues) {
  return api<ApiResponse<null>>(API_ROUTES.auth.forgotPassword, {
    method: "POST",
    body: payload,
  });
}

export async function resetPassword(payload: ResetPasswordFormValues) {
  return api<ApiResponse<null>>(API_ROUTES.auth.resetPassword, {
    method: "POST",
    body: payload,
  });
}

export async function googleLogin(idToken: string) {
  return api<ApiResponse<AuthTokens>>(API_ROUTES.auth.google, {
    method: "POST",
    body: {
      idToken,
    },
  });
}
