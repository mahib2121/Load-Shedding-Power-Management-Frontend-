import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import { API_ROUTES } from "@/constants/api";

export type ProfileImageResponse = {
  profileImage?: string | null;
  profilePicture?: string | null;
  avatar?: string | null;
  image?: string | null;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    profileImage?: string | null;
    profilePicture?: string | null;
    avatar?: string | null;
    image?: string | null;
  };
};

export async function uploadProfileImage(
  file: File,
): Promise<ApiResponse<ProfileImageResponse>> {
  const formData = new FormData();
  formData.append("profileImage", file);

  return api<ApiResponse<ProfileImageResponse>>(API_ROUTES.users.profileImage, {
    method: "PATCH",
    body: formData,
  });
}
