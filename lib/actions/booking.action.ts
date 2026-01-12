"use server";

import { apiRequest } from "../api-client";

interface CreateBookingParams {
  eventId: string;
  name: string;
  email: string;
}

export async function createBooking(params: CreateBookingParams) {
  try {
    console.debug("[createBooking] Called with params:", params);

    const { eventId, name, email } = params;

    const response = await apiRequest<{
      success: boolean;
      message: string;
      booking?: any;
    }>(`/api/events/${eventId}/book`, {
      method: "POST",
      body: JSON.stringify({ name, email }),
    });

    console.debug("[createBooking] API response:", response);

    return response;
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create booking",
    };
  }
}

export async function getBookingByEventSlug(slug: string) {
  try {
    const event = await apiRequest<{ _id: string }>(`/api/events/${slug}`);
    if (!event) {
      return null;
    }
    return 0;
  } catch (error) {
    console.error("Error getting booking by eventSlug:", error);
    return null;
  }
}

