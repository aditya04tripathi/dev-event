"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
	CalendarIcon,
	ClockIcon,
	GlobeIcon,
	MapPinIcon,
	UsersIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/axios";
import { queryKeys } from "@/hooks/api/query-keys";
import type {
	ApiResponse,
	EventResponse,
	PaginatedParticipantResponse,
} from "@/types/api-types";
import BookEvent from "@/components/event/book-event";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const EventTags = ({ tags }: { tags: string[] }) => (
	<div className="flex flex-wrap gap-2">
		{tags.map((tag) => (
			<Badge key={tag} variant="secondary" className="px-3 py-1">
				{tag}
			</Badge>
		))}
	</div>
);

const EventAgenda = ({ agenda }: { agenda: string[] }) => (
	<div className="flex flex-col items-start gap-2">
		<h2 className="text-2xl sm:text-3xl md:text-4xl">Agenda</h2>
		<ul className="space-y-2 w-full">
			{agenda.map((item, index) => (
				<li key={index} className="flex gap-3 text-sm sm:text-base">
					<span className="text-muted-foreground shrink-0">{index + 1}.</span>
					<span className="leading-relaxed">{item}</span>
				</li>
			))}
		</ul>
	</div>
);

export function EventDetailsContent({ slug }: { slug: string }) {
	const { data: event } = useSuspenseQuery({
		queryKey: queryKeys.events.detail(slug),
		queryFn: async () => {
			const { data } = await api.get<ApiResponse<EventResponse>>(
				`/event/${slug}`,
			);
			return data.data;
		},
	});

	// Publicly we don't have a count endpoint yet
	const bookingCount = 0;

	const {
		title,
		description,
		image,
		overview,
		date,
		time,
		location,
		mode,
		agenda,
		audience,
		tags,
		organizerId, // Note: backend returns organizerId, maybe need to fetch organizer name if not in response
	} = event;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
			<div className="lg:col-span-2 space-y-5 sm:space-y-6">
				<Image
					src={image}
					alt={title}
					width={800}
					height={450}
					className="w-full h-auto object-cover rounded"
				/>

				<div className="flex flex-col items-start gap-2">
					<h2 className="text-2xl sm:text-3xl md:text-4xl">Overview</h2>
					<p className="text-sm sm:text-base leading-relaxed">{overview}</p>
				</div>

				<div className="flex flex-col items-start gap-2">
					<h2 className="text-2xl sm:text-3xl md:text-4xl">Event Details</h2>
					<div className="flex flex-col items-start gap-2 w-full">
						<div className="flex items-center gap-2 text-sm sm:text-base">
							<CalendarIcon className="size-4 text-muted-foreground shrink-0" />
							<span>{date}</span>
						</div>
						<div className="flex items-center gap-2 text-sm sm:text-base">
							<ClockIcon className="size-4 text-muted-foreground shrink-0" />
							<span>{time}</span>
						</div>
						<div className="flex items-center gap-2 text-sm sm:text-base">
							<MapPinIcon className="size-4 text-muted-foreground shrink-0" />
							<span>{location}</span>
						</div>
						<div className="flex items-center gap-2 text-sm sm:text-base">
							<UsersIcon className="size-4 text-muted-foreground shrink-0" />
							<span>{audience}</span>
						</div>
						<div className="flex items-center gap-2 text-sm sm:text-base">
							<GlobeIcon className="size-4 text-muted-foreground shrink-0" />
							<span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
						</div>
					</div>
				</div>

				{agenda && agenda.length > 0 && <EventAgenda agenda={agenda} />}

				<div className="flex flex-col items-start gap-2">
					<h2 className="text-2xl sm:text-3xl md:text-4xl">
						About the Organizer
					</h2>
					<Link
						href={`/organizers/${typeof organizerId === 'string' ? organizerId : organizerId._id}`}
						className="text-primary hover:underline font-medium"
					>
						{typeof organizerId === 'string' ? 'View Organizer Profile' : organizerId.fullName}
					</Link>
				</div>

				<div>
					<EventTags tags={tags} />
				</div>
			</div>

			<div className="lg:col-span-1">
				<Card className="lg:sticky lg:top-22">
					<CardHeader>
						<CardTitle>
							<h3 className="text-xl sm:text-2xl">Book Your Spot</h3>
						</CardTitle>
						<CardDescription className="text-sm">
							{bookingCount > 0
								? `Join ${bookingCount} people(s) who have already booked their spot(s).`
								: "Be the first to book your spot."}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<BookEvent eventId={event._id} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
