import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface OrganizerStats {
  totalEvents: number;
  totalBookings: number;
  totalCheckIns: number;
  events: any[]; // We might not need the full list here if we just want stats
}

export const useOrganizerStats = () => {
  return useQuery({
    queryKey: ["organizer-stats"],
    queryFn: async () => {
      const { data } = await api.get<any>("/analytics/organizer");
      return data.data as OrganizerStats;
    },
  });
};
