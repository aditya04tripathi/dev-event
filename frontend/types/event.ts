export interface Event {
	_id: string;
	title: string;
	slug: string;
	description: string;
	overview: string;
	image: string;
	venue: string;
	location: string;
	date: string;
	time: string;
	mode: "online" | "offline" | "hybrid";
	audience: string;
	agenda: string[];
	organizer: string;
	organizerId?: string;
	tags: string[];
	createdAt: string;
	updatedAt: string;
}
