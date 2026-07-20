"use server";

import { serverApiFetch, serverApiFetchQuery } from "@/lib/api/server";
import type {
  BookingResponse,
  CheckInResponse,
  PaginatedParticipantResponse,
} from "@/types/api-types";

export async function listMyBookingsAction() {
  const response = await serverApiFetch<unknown[]>("/bookings/my-bookings");
  return response.data ?? [];
}

export async function getBookingTicketAction(id: string) {
  const response = await serverApiFetch<unknown>(`/bookings/ticket/${id}`);
  return response.data;
}

export async function listParticipantsAction(
  eventId: string,
  params?: { page?: number; limit?: number; search?: string },
) {
  const response = await serverApiFetchQuery<PaginatedParticipantResponse>(
    `/event/${eventId}/participants`,
    params,
  );
  return response.data;
}

export async function bookEventAction(
  eventId: string,
  bookingData: { name: string; email: string },
) {
  const response = await serverApiFetch<BookingResponse>(
    `/event/${eventId}/book`,
    { method: "POST", body: bookingData, auth: false },
  );
  return response.data;
}

export async function checkInParticipantAction(
  eventId: string,
  checkInData: { email: string },
) {
  const response = await serverApiFetch<CheckInResponse>(
    `/event/${eventId}/checkin`,
    { method: "POST", body: checkInData },
  );
  return response.data;
}

export async function resendQrCodeAction(eventId: string, email: string) {
  const response = await serverApiFetch<BookingResponse>(
    `/event/${eventId}/participants/resend-qr`,
    { method: "POST", body: { email } },
  );
  return response.data;
}

export async function removeParticipantAction(
  eventId: string,
  bookingId: string,
) {
  const response = await serverApiFetch<unknown>(
    `/event/${eventId}/participants/${bookingId}`,
    { method: "DELETE" },
  );
  return response.data;
}
