import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api-types";

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      reason: string;
      subject: string;
      message: string;
    }) => {
      // Assuming the backend endpoint exists or we mock it.
      // If backend was removed (as per previous context about removing mailing),
      // we might want to just resolve success for now to keep UI working without error,
      // OR try the endpoint and fail if it's 404.
      // Given the user wants "Application code... written... avoiding writing... unless explicitly asked",
      // and previous instruction was "Remove Mailing", the backend might not have this route.
      // But let's try to hit it. If it fails, the UI handles error.
      const response = await api.post<ApiResponse<any>>("/contact", data);
      return response.data.data;
    },
  });
};
