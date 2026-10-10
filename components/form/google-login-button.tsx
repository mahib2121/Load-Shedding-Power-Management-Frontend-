"use client";

import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { googleLogin } from "@/app/(auth)/_features/auth.api";
import { AUTH_QUERY_KEYS } from "@/app/(auth)/_features/auth.hook";

export default function GoogleSignInButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      <GoogleLogin
        text="continue_with"
        shape="rectangular"
        width="320"
        onSuccess={async (response) => {
          if (!response.credential || isLoading) {
            return;
          }

          setIsLoading(true);

          try {
            await googleLogin(response.credential);

            // Fetch the authenticated user using the existing auth query.
            await queryClient.invalidateQueries({
              queryKey: AUTH_QUERY_KEYS.me,
            });

            toast.success("Google login successful");

            router.replace("/dashboard");
            router.refresh();
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Google login failed. Please try again.",
            );
          } finally {
            setIsLoading(false);
          }
        }}
        onError={() => {
          toast.error("Google sign-in was unsuccessful.");
        }}
      />

      {isLoading && (
        <p className="text-sm text-muted-foreground">Signing you in...</p>
      )}
    </div>
  );
}
