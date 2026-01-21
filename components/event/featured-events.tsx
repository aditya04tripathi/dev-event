"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { queryKeys } from "@/hooks/api/query-keys";
import type { ApiResponse, PaginatedEventResponse } from "@/types/api-types";
import EventCard from "@/components/event/event-card";
import { Card, CardContent } from "@/components/ui/card";

export function FeaturedEvents() {
	const { data } = useSuspenseQuery({
		queryKey: queryKeys.events.list({ limit: 3 }),
		queryFn: async () => {
			const { data } = await api.get<ApiResponse<PaginatedEventResponse>>(
				"/event",
				{ params: { limit: 3 } },
			);
			return data.data;
		},
	});

	if (!data?.events || data.events.length === 0) {
		return (
			<Card>
				<CardContent className="p-4 sm:p-6">
					<div className="text-center">
						<p className="text-muted-foreground text-sm sm:text-base">
							No events found
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
			{data.events.map((event) => (
				<li key={event._id}>
					<EventCard event={event} />
				</li>
			))}
		</ul>
	);
}
