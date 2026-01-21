"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type {
	ApiResponse,
	EventResponse,
	PaginatedEventResponse,
} from "@/types/api-types";
import EventCard from "@/components/event/event-card";
import { Card, CardContent } from "@/components/ui/card";

interface SimilarEventsProps {
	slug: string;
}

export function SimilarEvents({ slug }: SimilarEventsProps) {
	const { data: similarEvents } = useSuspenseQuery({
		queryKey: ["events", "similar", slug],
		queryFn: async () => {
			// First get the event to get its tags
			const { data: eventRes } = await api.get<ApiResponse<EventResponse>>(
				`/event/${slug}`,
			);
			if (!eventRes.data) return [];

			const { data: listRes } = await api.get<
				ApiResponse<PaginatedEventResponse>
			>("/event", { params: { tags: eventRes.data.tags.join(","), limit: 7 } });

			return listRes.data.events.filter((e) => e.slug !== slug).slice(0, 6);
		},
	});

	return (
		<>
			{similarEvents.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
					{similarEvents.map((event) => (
						<EventCard key={event.slug} event={event} />
					))}
				</div>
			) : (
				<Card>
					<CardContent className="py-6 sm:py-8">
						<p className="text-center text-muted-foreground text-sm sm:text-base">
							No similar events found
						</p>
					</CardContent>
				</Card>
			)}
		</>
	);
}
