import type { Metadata } from "next";
import NewEventForm from "@/components/forms/new-event-form";

export const metadata: Metadata = {
	title: "Create New Event | DevEvent",
	description:
		"Share your tech event with the community. Create a new event on DevEvent and reach thousands of developers.",
	keywords: [
		"create event",
		"host event",
		"tech community",
		"developer events",
	],
};

export default function NewEventPage() {
	return (
		<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
			<div className="mb-6 sm:mb-8">
				<h1 className="font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
					Create New Event
				</h1>
				<p className="text-base sm:text-lg text-muted-foreground mt-1 sm:mt-2">
					Fill in the details to create a new event
				</p>
			</div>

			<NewEventForm />
		</div>
	);
}
