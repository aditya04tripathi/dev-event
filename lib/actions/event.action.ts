"use server";

import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import Event, { type IEvent } from "@/database/event.model";
import connectDB from "../mongodb";

// Configure Cloudinary
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

/**
 * Get all events with pagination and search
 */
export async function getEvents(
  params: GetEventsParams = {}
): Promise<PaginatedEventsResponse> {
  try {
    await connectDB();

    const { page = 1, limit = 9, search = "", tags = [], mode } = params;

    // Build query
    const query: any = {};

    // Search in title, description, location, and organizer
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { organizer: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by tags
    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    // Filter by mode
    if (mode) {
      query.mode = mode;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const totalEvents = await Event.countDocuments(query);

    // Get events
    const events = await Event.find(query)
      .sort({ createdAt: -1 })
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
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      events: [],
      totalEvents: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }
}

/**
 * Get a single event by slug
 */
export async function getEventBySlug(slug: string) {
  try {
    await connectDB();

    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      return null;
    }

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

/**
 * Get similar events by slug
 */
export async function getSimilarEventsBySlug(slug: string) {
  try {
    await connectDB();

    const event = await Event.findOne({ slug });
    if (!event) return [];

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    })
      .limit(6)
      .lean();

    return JSON.parse(JSON.stringify(similarEvents));
  } catch (error) {
    console.error("Error fetching similar events:", error);
    return [];
  }
}

/**
 * Create a new event
 */
export async function createEvent(formData: FormData) {
  try {
    await connectDB();

    // Extract form data
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

    // Validate required fields
    if (!title || !slug || !description || !overview || !venue || !location) {
      return {
        success: false,
        message: "Please fill in all required fields",
      };
    }

    if (!file) {
      return {
        success: false,
        message: "Image is required",
      };
    }

    // Check if slug already exists
    const existingEvent = await Event.findOne({ slug });
    if (existingEvent) {
      return {
        success: false,
        message: "An event with this slug already exists",
      };
    }

    // Parse tags and agenda
    const tags = JSON.parse(tagsString);
    const agenda = JSON.parse(agendaString);

    // Upload image to Cloudinary
    let imageUrl: string;

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      // Cloudinary not configured - use placeholder or return error
      return {
        success: false,
        message:
          "Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables.",
      };
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
            }
          )
          .end(buffer);
      }
    );

    imageUrl = uploadResult.secure_url;

    // Create event
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

    return {
      success: true,
      message: "Event created successfully",
      event: JSON.parse(JSON.stringify(event)),
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create event",
    };
  }
}

/**
 * Search events by query
 */
export async function searchEvents(query: string) {
  try {
    await connectDB();

    const events = await Event.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { organizer: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    })
      .limit(10)
      .lean();

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Error searching events:", error);
    return [];
  }
}

/**
 * Get all unique tags
 */
export async function getAllTags() {
  try {
    await connectDB();

    const tags = await Event.distinct("tags");

    return tags.sort();
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}
