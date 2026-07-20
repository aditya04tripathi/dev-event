"use server";

import {
  serverApiFetch,
  serverApiFetchFormData,
  serverApiFetchQuery,
} from "@/lib/api/server";
import type { EventResponse, PaginatedEventResponse } from "@/types/api-types";

export type EventsListParams = {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  mode?: string;
  organizerId?: string;
};

export async function getEventBySlug(slug: string) {
  const response = await serverApiFetch<EventResponse>(`/event/${slug}`, {
    next: { revalidate: 60 },
    auth: false,
  });
  return response.data;
}

export async function getFeaturedEvents(limit = 6) {
  const response = await serverApiFetchQuery<PaginatedEventResponse>(
    "/event",
    { limit, page: 1 },
    { next: { revalidate: 60 }, auth: false },
  );
  return response.data;
}

export async function listEventsAction(params?: EventsListParams) {
  const response = await serverApiFetchQuery<PaginatedEventResponse>(
    "/event",
    params,
    { auth: false },
  );
  return response.data;
}

export async function getEventAction(idOrSlug: string) {
  const response = await serverApiFetch<EventResponse>(`/event/${idOrSlug}`, {
    auth: false,
  });
  return response.data;
}

export async function listMyEventsAction(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const response = await serverApiFetchQuery<PaginatedEventResponse>(
    "/event/organizer/my-events",
    params,
  );
  return response.data;
}

export async function createEventAction(formData: FormData) {
  const response = await serverApiFetchFormData<EventResponse>(
    "/event",
    formData,
    "POST",
  );
  return response.data;
}

export async function updateEventAction(id: string, formData: FormData) {
  const response = await serverApiFetchFormData<EventResponse>(
    `/event/${id}`,
    formData,
    "PATCH",
  );
  return response.data;
}

export async function deleteEventAction(id: string) {
  const response = await serverApiFetch<unknown>(`/event/${id}`, {
    method: "DELETE",
  });
  return response.data;
}

export async function getSimilarEventsAction(slug: string, limit = 4) {
  const eventResponse = await serverApiFetch<EventResponse>(`/event/${slug}`, {
    auth: false,
  });
  const event = eventResponse.data;
  const tag = event.tags[0];
  const listResponse = await serverApiFetchQuery<PaginatedEventResponse>(
    "/event",
    { limit: limit + 1, tags: tag ? [tag] : undefined },
    { auth: false },
  );
  return listResponse.data.events.filter((item) => item.slug !== slug).slice(0, limit);
}
