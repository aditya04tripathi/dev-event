import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import type { IEvent } from "@/database/event.model";

export interface PaginatedEventsResponse {
	events: IEvent[];
	totalEvents: number;
	totalPages: number;
	currentPage: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const searchParams = request.nextUrl.searchParams;
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "9", 10);
		const search = searchParams.get("search") || "";
		const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
		const mode = searchParams.get("mode") || undefined;

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

		const response: PaginatedEventsResponse = {
			events: JSON.parse(JSON.stringify(events)),
			totalEvents,
			totalPages,
			currentPage: page,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error("[GET /api/events] Error:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch events",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
