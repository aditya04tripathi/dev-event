import EventCard from "@/components/event-card";
import { Card, CardContent } from "@/components/ui/card";
import type { IEvent } from "@/database/event.model";
import { getSimilarEventsBySlug } from "@/lib/actions/event.action";

interface SimilarEventsProps {
	slug: string;
}

export async function SimilarEvents({ slug }: SimilarEventsProps) {
	const similarEvents = await getSimilarEventsBySlug(slug);

	return (
		<>
			{similarEvents.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
					{similarEvents.map((event: IEvent) => (
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
