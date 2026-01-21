import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ApiResponse, AuthResponse } from "@/types/api-types";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (credentials: any) => {
      const { data } = await api.post<ApiResponse<AuthResponse>>(
        "/auth/sign-in",
        credentials,
      );
      return data.data;
    },
  });
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: async (userData: any) => {
      const { data } = await api.post<ApiResponse<AuthResponse>>(
        "/auth/sign-up",
        userData,
      );
      return data.data;
    },
  });
};
