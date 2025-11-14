import EventCard from "@/components/event-card";
import { Card, CardContent } from "@/components/ui/card";
import type { IEvent } from "@/database/event.model";
import { getEvents } from "@/lib/actions/event.action";

export async function FeaturedEvents() {
	const { events } = await getEvents({ page: 1, limit: 12 });

	return (
		<>
			{events && events.length > 0 ? (
				<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
					{events.map((event: IEvent) => (
						<li
							key={
								event._id?.toString() ?? (Math.random().toString() as string)
							}
						>
							<EventCard event={event} />
						</li>
					))}
				</ul>
			) : (
				<Card>
					<CardContent className="p-4 sm:p-6">
						<div className="text-center">
							<p className="text-muted-foreground text-sm sm:text-base">
								No events found
							</p>
						</div>
					</CardContent>
				</Card>
			)}
		</>
	);
}
