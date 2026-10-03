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
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
  });
}