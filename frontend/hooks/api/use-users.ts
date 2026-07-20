import { useQuery } from "@tanstack/react-query";
import { getUserAction } from "@/lib/actions/users";
import { queryKeys } from "./query-keys";

export const useUserInfo = (id: string) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => getUserAction(id),
    enabled: !!id,
  });
};
