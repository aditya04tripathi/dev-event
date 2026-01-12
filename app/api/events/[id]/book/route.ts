import { type NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import Booking from "@/database/booking.model";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { encryptData } from "@/lib/utils";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();
		const { id } = await params;

		const body = await request.json();
		const { name, email } = body;

		if (!name || !email) {
			return NextResponse.json(
				{ success: false, message: "Name and email are required" },
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

		const existingBooking = await Booking.findOne({
			eventId: event._id,
			email,
		});

		if (existingBooking) {
			return NextResponse.json(
				{ success: false, message: "You have already booked this event" },
				{ status: 409 },
			);
		}

		const booking = await Booking.create({
			eventId: event._id,
			name,
			email,
		});

		const qrData = JSON.stringify({
			bookingId: booking._id.toString(),
			eventId: event._id.toString(),
			eventTitle: event.title,
			name,
			email,
			timestamp: booking.createdAt.toISOString(),
		});

		const encryptedData = encryptData(qrData);

		const qrCodeBase64 = await QRCode.toDataURL(encryptedData, {
			errorCorrectionLevel: "H",
			type: "image/png",
			width: 300,
			margin: 2,
		});

		// Email sending removed as per user request
		console.log(`[Booking] Confirmed for ${email} on event ${event.title}`);

		return NextResponse.json({
			success: true,
			message:
				"Booking confirmed! (Email notifications are currently disabled)",
			booking: JSON.parse(JSON.stringify(booking)),
			qrCode: qrCodeBase64,
		});
	} catch (error) {
		console.error("[POST /api/events/:id/book] Error:", error);
		return NextResponse.json(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "Failed to create booking",
			},
			{ status: 500 },
		);
	}
}
