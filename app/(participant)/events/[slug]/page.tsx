import type { Metadata } from "next";
import { Suspense } from "react";
import { api } from "@/lib/axios";
import type { ApiResponse, EventResponse } from "@/types/api-types";
import { EventDetailsContent } from "@/components/event/event-details-content";
import { SimilarEvents } from "@/components/event/similar-events";
import { SimilarEventsSkeleton } from "@/components/event/similar-events-skeleton";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type RouteParams = {
	params: Promise<{
		slug: string;
	}>;
};

export async function generateMetadata({
	params,
}: RouteParams): Promise<Metadata> {
	const { slug } = await params;

	try {
		const { data } = await api.get<ApiResponse<EventResponse>>(
			`/event/${slug}`,
		);
		const event = data.data;

		return {
			title: `${event.title} | DevEvent`,
			description: event.description,
			keywords: [
				...event.tags,
				"tech event",
				"developer event",
				event.mode,
				event.location,
			],
			openGraph: {
				title: event.title,
				description: event.description,
				images: [
					{
						url: event.image,
						width: 1200,
						height: 630,
						alt: event.title,
					},
				],
				type: "website",
			},
		};
	} catch {
		return {
			title: "Event Not Found | DevEvent",
			description: "The requested event could not be found.",
		};
	}
}

const EventDetailsPage = async ({ params }: RouteParams) => {
	const { slug } = await params;

	return (
		<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
			<Suspense
				fallback={
					<div className="space-y-8">
						<Skeleton className="h-16 w-3/4" />
						<Skeleton className="h-[400px] w-full" />
					</div>
				}
			>
				<EventDetailsContent slug={slug} />
			</Suspense>

			<div className="mt-12 sm:mt-14 md:mt-16 space-y-5 sm:space-y-6">
				<Separator />
				<div>
					<h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 sm:mb-6">
						Similar Events
					</h2>

					<Suspense fallback={<SimilarEventsSkeleton />}>
						<SimilarEvents slug={slug} />
					</Suspense>
				</div>
			</div>
		</div>
	);
};

export default EventDetailsPage;
