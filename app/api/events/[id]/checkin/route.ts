import { type NextRequest, NextResponse } from "next/server";
import Booking from "@/database/booking.model";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { decryptData } from "@/lib/utils";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();
		const { id } = await params;

		const body = await request.json();
		const { qrData } = body;

		if (!qrData) {
			return NextResponse.json(
				{ success: false, message: "QR code data is required" },
				{ status: 400 },
			);
		}

		let decryptedData: {
			bookingId: string;
			eventId: string;
			eventTitle: string;
			name: string;
			email: string;
			timestamp: string;
		};

		try {
			const decrypted = decryptData(qrData);
			decryptedData = JSON.parse(decrypted);
		} catch (error) {
			return NextResponse.json(
				{ success: false, message: "Invalid QR code format" },
				{ status: 400 },
			);
		}

		const event = await Event.findOne({
			$or: [{ _id: id }, { slug: id }],
		});

		if (!event) {
			return NextResponse.json(
				{ success: false, message: "Event not found" },
				{ status: 404 },
			);
		}

		if (decryptedData.eventId !== event._id.toString()) {
			return NextResponse.json(
				{
					success: false,
					message: "QR code does not match this event",
				},
				{ status: 400 },
			);
		}

		const booking = await Booking.findById(decryptedData.bookingId);

		if (!booking) {
			return NextResponse.json(
				{ success: false, message: "Booking not found" },
				{ status: 404 },
			);
		}

		if (booking.eventId.toString() !== event._id.toString()) {
			return NextResponse.json(
				{
					success: false,
					message: "Booking does not match this event",
				},
				{ status: 400 },
			);
		}

		if (booking.email !== decryptedData.email) {
			return NextResponse.json(
				{
					success: false,
					message: "Email mismatch",
				},
				{ status: 400 },
			);
		}

		return NextResponse.json({
			success: true,
			message: "Check-in successful",
			booking: {
				id: booking._id.toString(),
				name: booking.name,
				email: booking.email,
				eventTitle: event.title,
				checkedInAt: new Date().toISOString(),
			},
		});
	} catch (error) {
		console.error("[POST /api/events/:id/checkin] Error:", error);
		return NextResponse.json(
			{
				success: false,
				message:
					error instanceof Error
						? error.message
						: "Failed to validate check-in",
			},
			{ status: 500 },
		);
	}
}
