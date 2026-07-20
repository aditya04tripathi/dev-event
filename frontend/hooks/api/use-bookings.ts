import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookEventAction,
  checkInParticipantAction,
  listParticipantsAction,
  removeParticipantAction,
  resendQrCodeAction,
} from "@/lib/actions/bookings";
import { queryKeys } from "./query-keys";

export const useParticipants = (
  eventId: string,
  params?: { page?: number; limit?: number; search?: string },
) => {
  return useQuery({
    queryKey: queryKeys.participants.list(eventId, params),
    queryFn: () => listParticipantsAction(eventId, params),
    enabled: !!eventId,
  });
};

export const useBookEvent = () => {
  return useMutation({
    mutationFn: ({
      eventId,
      bookingData,
    }: {
      eventId: string;
      bookingData: { name: string; email: string };
    }) => bookEventAction(eventId, bookingData),
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      checkInData,
    }: {
      eventId: string;
      checkInData: { email: string };
    }) => checkInParticipantAction(eventId, checkInData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.participants.list(variables.eventId, {}),
      });
    },
  });
};

export const useResendQRCode = () => {
  return useMutation({
    mutationFn: ({ eventId, email }: { eventId: string; email: string }) =>
      resendQrCodeAction(eventId, email),
  });
};

export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      bookingId,
    }: {
      eventId: string;
      bookingId: string;
    }) => removeParticipantAction(eventId, bookingId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.participants.list(variables.eventId, {}),
      });
    },
  });
};
