import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { EventResponse } from "@/types/api-types";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";

interface Props {
	event: EventResponse;
}

const EventCard = ({ event }: Props) => {
	if (!event) return <div>no evt</div>;

	return (
		<Card className="overflow-hidden transition-all">
			<CardHeader>
				<Image
					src={event.image}
					alt={event.title}
					width={410}
					height={300}
					className="aspect-video object-cover w-full rounded"
				/>
			</CardHeader>

			<CardContent>
				<div className="flex items-center gap-2 text-muted-foreground">
					<MapPinIcon className="size-4" />
					<p className="text-sm">{event.location}</p>
				</div>

				<h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
					{event.title}
				</h3>
			</CardContent>

			<CardFooter className="p-4 pt-0 flex items-center justify-between gap-4 text-sm text-muted-foreground">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2">
						<CalendarIcon className="size-4" />
						<span>{event.date}</span>
					</div>
					<div className="flex items-center gap-2">
						<ClockIcon className="size-4" />
						<span>{event.time}</span>
					</div>
				</div>
				<Link href={`/events/${event.slug}`} className="block group">
					<Button variant={"link"}>View Event</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default EventCard;
