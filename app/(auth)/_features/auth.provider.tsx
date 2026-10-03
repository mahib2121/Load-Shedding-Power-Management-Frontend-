"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { getMe, refreshToken, logout as logoutRequest } from "./auth.api";

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

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const response = await getMe();

        if (mounted) {
          setUser(response.data);
        }
      } catch {
        try {
          await refreshToken();

          const response = await getMe();

          if (mounted) {
            setUser(response.data);
          }
        } catch {
          if (mounted) {
            setUser(null);
          }
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      setUser(null);

      queryClient.clear();

      router.replace("/login");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
