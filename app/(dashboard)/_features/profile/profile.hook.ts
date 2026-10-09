import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfileImage } from "./profile.api";

export function useUploadProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["auth"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
}
