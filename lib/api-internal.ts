import type { IEvent } from "@/database/event.model";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

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

export async function getEventsInternal(
	params: GetEventsParams = {},
): Promise<PaginatedEventsResponse> {
	await connectDB();

	const { page = 1, limit = 9, search = "", tags = [], mode } = params;

	const query: any = {};

	if (search) {
		query.$or = [
			{ title: { $regex: search, $options: "i" } },
			{ description: { $regex: search, $options: "i" } },
			{ location: { $regex: search, $options: "i" } },
			{ organizer: { $regex: search, $options: "i" } },
		];
	}

	if (tags.length > 0) {
		query.tags = { $in: tags };
	}

	if (mode) {
		query.mode = mode;
	}

	const skip = (page - 1) * limit;
	const totalEvents = await Event.countDocuments(query);

	const events = await Event.find(query)
		.sort({ date: 1 })
		.skip(skip)
		.limit(limit)
		.lean();

	const totalPages = Math.ceil(totalEvents / limit);

	return {
		events: JSON.parse(JSON.stringify(events)),
		totalEvents,
		totalPages,
		currentPage: page,
		hasNextPage: page < totalPages,
		hasPrevPage: page > 1,
	};
}

export async function getEventBySlugInternal(
	slug: string,
): Promise<IEvent | null> {
	await connectDB();

	const mongoose = await import("mongoose");
	const isValidObjectId = mongoose.default.Types.ObjectId.isValid(slug);

	const query: any = isValidObjectId
		? { $or: [{ _id: slug }, { slug }] }
		: { slug };

	const event = await Event.findOne(query).lean();

	if (!event) {
		return null;
	}

	return JSON.parse(JSON.stringify(event));
}
