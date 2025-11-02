import { type Document, model, models, Schema } from "mongoose";

export interface IContact extends Document {
	name: string;
	email: string;
	reason: string;
	subject: string;
	message: string;
	status: "pending" | "responded" | "archived";
	createdAt: Date;
	updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
			maxlength: [100, "Name cannot exceed 100 characters"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			trim: true,
			lowercase: true,
			validate: {
				validator: (email: string) => {
					const emailRegex =
						/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
					return emailRegex.test(email);
				},
				message: "Please provide a valid email address",
			},
		},
		reason: {
			type: String,
			required: [true, "Reason is required"],
			trim: true,
			enum: {
				values: [
					"General Inquiry",
					"Technical Support",
					"Partnership Opportunity",
					"Bug Report",
					"Feature Request",
					"Other",
				],
				message: "Please select a valid reason",
			},
		},
		subject: {
			type: String,
			required: [true, "Subject is required"],
			trim: true,
			maxlength: [200, "Subject cannot exceed 200 characters"],
		},
		message: {
			type: String,
			required: [true, "Message is required"],
			trim: true,
			maxlength: [5000, "Message cannot exceed 5000 characters"],
		},
		status: {
			type: String,
			enum: {
				values: ["pending", "responded", "archived"],
				message: "Status must be pending, responded, or archived",
			},
			default: "pending",
		},
	},
	{
		timestamps: true,
	},
);

// Indexes for efficient querying
ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ reason: 1 });
ContactSchema.index({ createdAt: -1 });

const Contact = models.Contact || model<IContact>("Contact", ContactSchema);
export default Contact;
