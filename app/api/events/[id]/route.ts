import { type NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();
		const { id } = await params;

		const event = await Event.findOne({
			$or: [{ _id: id }, { slug: id }],
		}).lean();

		if (!event) {
			return NextResponse.json({ error: "Event not found" }, { status: 404 });
		}

		return NextResponse.json(JSON.parse(JSON.stringify(event)));
	} catch (error) {
		console.error("[GET /api/events/:id] Error:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch event",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
