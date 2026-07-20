import { useQuery } from "@tanstack/react-query";
import {
  getOrganizerStatsAction,
  type OrganizerStats,
} from "@/lib/actions/analytics";

export type { OrganizerStats };

export const useOrganizerStats = () => {
  return useQuery({
    queryKey: ["organizer-stats"],
    queryFn: () => getOrganizerStatsAction(),
  });
};
