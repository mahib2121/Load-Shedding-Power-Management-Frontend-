import {
  forgotPassword,
  getMe,
  googleLogin,
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
} from "./auth.api";

import { useMutation, useQuery } from "@tanstack/react-query";

export const AUTH_QUERY_KEYS = {
  me: ["auth", "me"] as const,
};

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

export function useRegistration() {
  return useMutation({
    mutationFn: register,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: googleLogin,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: refreshToken,
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: getMe,
    retry: false,

    // User identity/role doesn't need to be refetched constantly.
    staleTime: 5 * 60 * 1000,

    // Keep the cached user around between component lifecycles.
    gcTime: 30 * 60 * 1000,

    // Don't refetch /me every time the browser window gets focus.
    refetchOnWindowFocus: false,
  });
}
