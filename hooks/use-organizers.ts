import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface Organizer {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  roles: string[];
}

export const useOrganizers = () => {
  return useQuery({
    queryKey: ["organizers"],
    queryFn: async () => {
      const { data } = await api.get<any>("/organizers");
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.data)) return data.data;
      return [];
    },
  });
};
