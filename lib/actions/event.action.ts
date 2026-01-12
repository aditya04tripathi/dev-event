"use server";

import { revalidatePath } from "next/cache";
import type { IEvent } from "@/database/event.model";
import { apiRequest, apiRequestFormData } from "../api-client";

export interface PaginatedEventsResponse {
	events: IEvent[];
	totalEvents: number;
	totalPages: number;
	currentPage: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export interface GetEventsParams {
	page?: number;
	limit?: number;
	search?: string;
	tags?: string[];
	mode?: string;
}

/**
 * Get all events with pagination and search
 */
export async function getEvents(
	params: GetEventsParams = {},
): Promise<PaginatedEventsResponse> {
	try {
		console.info("[getEvents] Starting with params:", params);

		const { page = 1, limit = 9, search = "", tags = [], mode } = params;

		const searchParams = new URLSearchParams();
		searchParams.set("page", page.toString());
		searchParams.set("limit", limit.toString());
		if (search) searchParams.set("search", search);
		if (tags.length > 0) searchParams.set("tags", tags.join(","));
		if (mode) searchParams.set("mode", mode);

		const response = await apiRequest<PaginatedEventsResponse>(
			`/api/events?${searchParams.toString()}`,
		);

		console.info("Fetched events.", response);
		return response;
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
		const event = await apiRequest<IEvent>(`/api/events/${slug}`);
		return event;
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
		const event = await apiRequest<IEvent>(`/api/events/${slug}`);
		if (!event) return [];

		const eventsResponse = await apiRequest<PaginatedEventsResponse>(
			`/api/events?tags=${event.tags.join(",")}&limit=7`,
		);

		const similarEvents = eventsResponse.events.filter(
			(e) => e.slug !== slug,
		);

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
		const searchParams = new URLSearchParams();
		searchParams.set("search", query);
		searchParams.set("limit", "10");

		const response = await apiRequest<PaginatedEventsResponse>(
			`/api/events?${searchParams.toString()}`,
		);

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
		const response = await apiRequest<PaginatedEventsResponse>(
			"/api/events?limit=1000",
		);

		const allTags = new Set<string>();
		response.events.forEach((event) => {
			event.tags.forEach((tag) => allTags.add(tag));
		});

		return Array.from(allTags).sort();
	} catch (error) {
		console.error("Error fetching tags:", error);
		return [];
	}
}
