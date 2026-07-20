import { useQuery } from "@tanstack/react-query";
import { listOrganizersAction } from "@/lib/actions/organizers";

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
    queryFn: () => listOrganizersAction() as Promise<Organizer[]>,
  });
};
