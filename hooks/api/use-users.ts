import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "./query-keys";
import type { ApiResponse, UserResponse } from "@/types/api-types";

export const useUserInfo = (id: string) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<UserResponse>>(`/user/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};
