"use server";

import Contact from "@/database/contact.model";
import connectDB from "../mongodb";

interface SubmitContactParams {
	name: string;
	email: string;
	reason: string;
	subject: string;
	message: string;
}

export async function submitContactForm(params: SubmitContactParams) {
	try {
		console.debug("[submitContactForm] Called with params:", {
			...params,
			message: `${params.message.substring(0, 50)}...`,
		});

		await connectDB();
		console.debug("[submitContactForm] Connected to DB");

		const { name, email, reason, subject, message } = params;

		// Validate required fields
		if (!name || !email || !reason || !subject || !message) {
			return {
				success: false,
				message: "All fields are required",
			};
		}

		// Save contact form submission to database
		const contactSubmission = await Contact.create({
			name,
			email,
			reason,
			subject,
			message,
			status: "pending",
		});

		console.debug(
			"[submitContactForm] Contact submission saved:",
			contactSubmission._id,
		);

		return {
			success: true,
			message: "Message sent successfully! We'll get back to you soon.",
		};
	} catch (error) {
		console.error("[submitContactForm] Error:", error);
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: "Failed to send message. Please try again.",
		};
	}
}

// Admin helper functions for managing contact submissions

export async function getAllContacts(params?: {
	status?: "pending" | "responded" | "archived";
	limit?: number;
	page?: number;
}) {
	try {
		await connectDB();

		const { status, limit = 20, page = 1 } = params || {};
		const skip = (page - 1) * limit;

		const query = status ? { status } : {};

		const [contacts, total] = await Promise.all([
			Contact.find(query)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			Contact.countDocuments(query),
		]);

		return {
			success: true,
			contacts: JSON.parse(JSON.stringify(contacts)),
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		};
	} catch (error) {
		console.error("[getAllContacts] Error:", error);
		return {
			success: false,
			message: "Failed to fetch contacts",
		};
	}
}

export async function updateContactStatus(params: {
	contactId: string;
	status: "pending" | "responded" | "archived";
}) {
	try {
		await connectDB();

		const { contactId, status } = params;

		const contact = await Contact.findByIdAndUpdate(
			contactId,
			{ status },
			{ new: true },
		);

		if (!contact) {
			return {
				success: false,
				message: "Contact not found",
			};
		}

		return {
			success: true,
			contact: JSON.parse(JSON.stringify(contact)),
		};
	} catch (error) {
		console.error("[updateContactStatus] Error:", error);
		return {
			success: false,
			message: "Failed to update contact status",
		};
	}
}

export async function deleteContact(contactId: string) {
	try {
		await connectDB();

		const contact = await Contact.findByIdAndDelete(contactId);

		if (!contact) {
			return {
				success: false,
				message: "Contact not found",
			};
		}

		return {
			success: true,
			message: "Contact deleted successfully",
		};
	} catch (error) {
		console.error("[deleteContact] Error:", error);
		return {
			success: false,
			message: "Failed to delete contact",
		};
	}
}
