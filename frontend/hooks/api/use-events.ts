import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "./query-keys";
import type {
  ApiResponse,
  EventResponse,
  PaginatedEventResponse,
  CreateEventRequest,
  UpdateEventRequest,
} from "@/types/api-types";

// Queries
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
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedEventResponse>>(
        "/event",
        { params },
      );
      return data.data;
    },
  });
};

export const useEvent = (idOrSlug: string) => {
  return useQuery({
    queryKey: queryKeys.events.detail(idOrSlug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<EventResponse>>(
        `/event/${idOrSlug}`,
      );
      return data.data;
    },
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
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedEventResponse>>(
        "/event/organizer/my-events",
        { params },
      );
      return data.data;
    },
  });
};

// Mutations
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventData: CreateEventRequest) => {
      // Need to handle File object properly for multipart/form-data
      // Axios usually handles this if we pass a FormData object or if we use proper serialization
      // But adhering to previous logic:
      const { data } = await api.post<ApiResponse<EventResponse>>(
        "/event",
        eventData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return data.data;
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
      eventData: UpdateEventRequest;
    }) => {
      const { data } = await api.patch<ApiResponse<EventResponse>>(
        `/event/${id}`,
        eventData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return data.data;
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
    mutationFn: async (id: string) => {
      const { data } = await api.delete<ApiResponse<any>>(`/event/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
};
