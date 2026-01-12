import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

if (
	process.env.CLOUDINARY_CLOUD_NAME &&
	process.env.CLOUDINARY_API_KEY &&
	process.env.CLOUDINARY_API_SECRET
) {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
}

export async function POST(request: NextRequest) {
	try {
		await connectDB();

		const formData = await request.formData();

		const title = formData.get("title") as string;
		const slug = formData.get("slug") as string;
		const description = formData.get("description") as string;
		const overview = formData.get("overview") as string;
		const venue = formData.get("venue") as string;
		const location = formData.get("location") as string;
		const date = formData.get("date") as string;
		const time = formData.get("time") as string;
		const mode = formData.get("mode") as string;
		const audience = formData.get("audience") as string;
		const organizer = formData.get("organizer") as string;
		const file = formData.get("image") as File;
		const tagsString = formData.get("tags") as string;
		const agendaString = formData.get("agenda") as string;

		if (!title || !slug || !description || !overview || !venue || !location) {
			return NextResponse.json(
				{ success: false, message: "Please fill in all required fields" },
				{ status: 400 },
			);
		}

		if (!file) {
			return NextResponse.json(
				{ success: false, message: "Image is required" },
				{ status: 400 },
			);
		}

		const existingEvent = await Event.findOne({ slug });
		if (existingEvent) {
			return NextResponse.json(
				{ success: false, message: "An event with this slug already exists" },
				{ status: 409 },
			);
		}

		const tags = JSON.parse(tagsString);
		const agenda = JSON.parse(agendaString);

		let imageUrl: string;

		if (
			!process.env.CLOUDINARY_CLOUD_NAME ||
			!process.env.CLOUDINARY_API_KEY ||
			!process.env.CLOUDINARY_API_SECRET
		) {
			return NextResponse.json(
				{
					success: false,
					message:
						"Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables.",
				},
				{ status: 500 },
			);
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const uploadResult = await new Promise<{ secure_url: string }>(
			(resolve, reject) => {
				cloudinary.uploader
					.upload_stream(
						{
							resource_type: "image",
							folder: "DevEvent/events",
						},
						(error, result) => {
							if (error) reject(error);
							else resolve(result as { secure_url: string });
						},
					)
					.end(buffer);
			},
		);

		imageUrl = uploadResult.secure_url;

		const event = await Event.create({
			title,
			slug,
			description,
			overview,
			image: imageUrl,
			venue,
			location,
			date,
			time,
			mode,
			audience,
			organizer,
			tags,
			agenda,
		});

		revalidatePath("/");
		revalidatePath("/events");
		revalidatePath(`/events/${slug}`);

		return NextResponse.json({
			success: true,
			message: "Event created successfully",
			event: JSON.parse(JSON.stringify(event)),
		});
	} catch (error) {
		console.error("Error creating event:", error);
		return NextResponse.json(
			{
				success: false,
				message:
					error instanceof Error ? error.message : "Failed to create event",
			},
			{ status: 500 },
		);
	}
}
