import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "./query-keys";
import type {
  ApiResponse,
  BookingResponse,
  CheckInResponse,
  PaginatedParticipantResponse,
} from "@/types/api-types";

// Queries
export const useParticipants = (
  eventId: string,
  params?: { page?: number; limit?: number; search?: string },
) => {
  return useQuery({
    queryKey: queryKeys.participants.list(eventId, params),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedParticipantResponse>>(
        `/event/${eventId}/participants`,
        { params },
      );
      return data.data;
    },
    enabled: !!eventId,
  });
};

// Mutations
export const useBookEvent = () => {
  return useMutation({
    mutationFn: async ({
      eventId,
      bookingData,
    }: {
      eventId: string;
      bookingData: { name: string; email: string };
    }) => {
      const { data } = await api.post<ApiResponse<BookingResponse>>(
        `/event/${eventId}/book`,
        bookingData,
      );
      return data.data;
    },
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      eventId,
      checkInData,
    }: {
      eventId: string;
      checkInData: { email: string };
    }) => {
      const { data } = await api.post<ApiResponse<CheckInResponse>>(
        `/event/${eventId}/checkin`,
        checkInData,
      );
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.participants.list(variables.eventId, {}),
      });
    },
  });
};

export const useResendQRCode = () => {
  return useMutation({
    mutationFn: async ({
      eventId,
      email,
    }: {
      eventId: string;
      email: string;
    }) => {
      const { data } = await api.post<ApiResponse<BookingResponse>>(
        `/event/${eventId}/participants/resend-qr`,
        { email },
      );
      return data.data;
    },
  });
};

export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      eventId,
      bookingId,
    }: {
      eventId: string;
      bookingId: string;
    }) => {
      const { data } = await api.delete<ApiResponse<any>>(
        `/event/${eventId}/participants/${bookingId}`,
      );
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.participants.list(variables.eventId, {}),
      });
    },
  });
};
