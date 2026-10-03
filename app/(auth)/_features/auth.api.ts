import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";

import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
} from "./auth.schima";

import type { AuthTokens, User } from "./auth.types";

export async function login(payload: LoginFormValues) {
  return api<ApiResponse<AuthTokens>>("/api/v1/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function register(payload: RegisterFormValues) {
  return api<ApiResponse<AuthTokens>>("/api/v1/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function getMe() {
  return api<ApiResponse<User>>("/api/v1/auth/me");
}

export async function refreshToken() {
  return api<ApiResponse<AuthTokens>>("/api/v1/auth/refresh-token", {
    method: "POST",
  });
}

export async function logout() {
  return api<ApiResponse<null>>("/api/v1/auth/logout", {
    method: "POST",
  });
}

export async function forgotPassword(payload: ForgotPasswordFormValues) {
  return api<ApiResponse<null>>("/api/v1/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export async function resetPassword(payload: ResetPasswordFormValues) {
  return api<ApiResponse<null>>("/api/v1/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

export async function googleLogin(idToken: string) {
  return api<ApiResponse<AuthTokens>>("/api/v1/auth/google", {
    method: "POST",
    body: {
      idToken,
    },
  });
}
