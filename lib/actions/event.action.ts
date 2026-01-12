"use server";

import { revalidatePath } from "next/cache";
import type { IEvent } from "@/database/event.model";
import { apiRequestFormData } from "../api-client";
import {
	type GetEventsParams,
	getEventBySlugInternal,
	getEventsInternal,
	type PaginatedEventsResponse,
} from "../api-internal";

export type { GetEventsParams, PaginatedEventsResponse } from "../api-internal";

/**
 * Get all events with pagination and search
 */
export async function getEvents(
	params: GetEventsParams = {},
): Promise<PaginatedEventsResponse> {
	try {
		console.info("[getEvents] Starting with params:", params);
		return await getEventsInternal(params);
	} catch (error) {
		console.error("[getEvents] Error fetching events:", error);
		if (error instanceof Error) {
			console.error("[getEvents] Error message:", error.message);
			console.error("[getEvents] Error stack:", error.stack);
		}
		return {
			events: [],
			totalEvents: 0,
			totalPages: 0,
			currentPage: 1,
			hasNextPage: false,
			hasPrevPage: false,
		};
	}
}

/**
 * Get a single event by slug
 */
export async function getEventBySlug(slug: string) {
	try {
		return await getEventBySlugInternal(slug);
	} catch (error) {
		console.error("Error fetching event:", error);
		return null;
	}
}

/**
 * Get similar events by slug
 */
export async function getSimilarEventsBySlug(slug: string) {
	try {
		const event = await getEventBySlugInternal(slug);
		if (!event) return [];

		const eventsResponse = await getEventsInternal({
			tags: event.tags,
			limit: 7,
		});

		const similarEvents = eventsResponse.events.filter((e) => e.slug !== slug);

		return similarEvents.slice(0, 6);
	} catch (error) {
		console.error("Error fetching similar events:", error);
		return [];
	}
}

/**
 * Create a new event
 */
export async function createEvent(formData: FormData) {
	try {
		const response = await apiRequestFormData<{
			success: boolean;
			message: string;
			event?: IEvent;
		}>("/api/events/create", formData);

		if (response.success) {
			revalidatePath("/");
			revalidatePath("/events");
			if (response.event) {
				revalidatePath(`/events/${response.event.slug}`);
			}
		}

		return response;
	} catch (error) {
		console.error("Error creating event:", error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : "Failed to create event",
		};
	}
}

/**
 * Search events by query
 */
export async function searchEvents(query: string) {
	try {
		const response = await getEventsInternal({
			search: query,
			limit: 10,
		});

		return response.events;
	} catch (error) {
		console.error("Error searching events:", error);
		return [];
	}
}

/**
 * Get all unique tags
 */
export async function getAllTags() {
	try {
		const response = await getEventsInternal({
			limit: 1000,
		});

		const allTags = new Set<string>();
		response.events.forEach((event) => {
			event.tags.forEach((tag) => {
				allTags.add(tag);
			});
		});

		return Array.from(allTags).sort();
	} catch (error) {
		console.error("Error fetching tags:", error);
		return [];
	}
}
