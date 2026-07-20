import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEventAction,
  deleteEventAction,
  getEventAction,
  listEventsAction,
  listMyEventsAction,
  updateEventAction,
} from "@/lib/actions/events";
import { toEventFormData } from "@/lib/event-form-data";
import { queryKeys } from "./query-keys";
import type { CreateEventRequest, UpdateEventRequest } from "@/types/api-types";

export const useEvents = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  mode?: string;
  organizerId?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.events.list(params),
    queryFn: () => listEventsAction(params),
  });
};

export const useEvent = (idOrSlug: string) => {
  return useQuery({
    queryKey: queryKeys.events.detail(idOrSlug),
    queryFn: () => getEventAction(idOrSlug),
    enabled: !!idOrSlug,
  });
};

export const useMyEvents = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.events.mine(params),
    queryFn: () => listMyEventsAction(params),
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      eventData: CreateEventRequest & { image: File | Blob },
    ) => {
      return createEventAction(
        toEventFormData(
          eventData as unknown as Record<string, string | File | Blob>,
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      eventData,
    }: {
      id: string;
      eventData: UpdateEventRequest & { image?: File | Blob };
    }) => {
      return updateEventAction(
        id,
        toEventFormData(
          eventData as unknown as Record<string, string | File | Blob>,
        ),
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.detail(data._id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.detail(data.slug),
      });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEventAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
};
