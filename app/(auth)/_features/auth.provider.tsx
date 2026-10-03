"use client";

import { createContext, useCallback, useContext, useMemo } from "react";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { refreshToken, logout as logoutRequest } from "./auth.api";
import { AUTH_QUERY_KEYS, useGetMe } from "./auth.hook";

import type { User } from "./auth.types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const meQuery = useGetMe();

  const user = meQuery.data?.data ?? null;

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      // Remove the authenticated user from the cache.
      queryClient.removeQueries({
        queryKey: AUTH_QUERY_KEYS.me,
      });

      // Clear other cached application data.
      queryClient.clear();

      router.replace("/login");
    }
  }, [queryClient, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading: meQuery.isLoading || meQuery.isFetching,
      isAuthenticated: !!user,
      logout,
    }),
    [user, meQuery.isLoading, meQuery.isFetching, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
