import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedModel } from 'src/types';

@Schema({ timestamps: true })
export class Event {
	@ApiProperty({
		example: 'Tech Conference 2024',
		description: 'Title of the event',
	})
	@Prop({
		required: [true, 'Title is required'],
		trim: true,
		maxlength: [100, 'Title cannot exceed 100 characters'],
	})
	title: string;

	@ApiProperty({
		example: 'tech-conference-2024',
		description: 'Slug of the event',
	})
	@Prop({
		lowercase: true,
		trim: true,
	})
	slug: string;

	@ApiProperty({
		example: 'A comprehensive guide to modern tech.',
		description: 'Description of the event',
	})
	@Prop({
		required: [true, 'Description is required'],
		trim: true,
		maxlength: [1000, 'Description cannot exceed 1000 characters'],
	})
	description: string;

	@ApiProperty({
		example: 'Join us for an amazing experience.',
		description: 'Brief overview of the event',
	})
	@Prop({
		required: [true, 'Overview is required'],
		trim: true,
		maxlength: [500, 'Overview cannot exceed 500 characters'],
	})
	overview: string;

	@ApiProperty({
		example: 'https://example.com/image.jpg',
		description: 'Cover image URL',
	})
	@Prop({
		required: [true, 'Image URL is required'],
		trim: true,
	})
	image: string;

	@ApiProperty({ example: 'Convention Center', description: 'Venue name' })
	@Prop({
		required: [true, 'Venue is required'],
		trim: true,
	})
	venue: string;

	@ApiProperty({
		example: 'San Francisco, CA',
		description: 'Physical location',
	})
	@Prop({
		required: [true, 'Location is required'],
		trim: true,
	})
	location: string;

	@ApiProperty({
		example: '2024-12-25T10:00:00.000Z',
		description: 'Date of the event',
	})
	@Prop({
		required: [true, 'Date is required'],
	})
	date: string;

	@ApiProperty({ example: '10:00 AM', description: 'Time of the event' })
	@Prop({
		required: [true, 'Time is required'],
	})
	time: string;

	@ApiProperty({
		example: 'hybrid',
		enum: ['online', 'offline', 'hybrid'],
		description: 'Mode of the event',
	})
	@Prop({
		required: [true, 'Mode is required'],
		enum: {
			values: ['online', 'offline', 'hybrid'],
			message: 'Mode must be either online, offline, or hybrid',
		},
		index: true,
	})
	mode: string;

	@ApiProperty({ example: 'Developers', description: 'Target audience' })
	@Prop({
		required: [true, 'Audience is required'],
		trim: true,
	})
	audience: string;

	@ApiProperty({
		example: ['Opening Keynote', 'Workshop'],
		description: 'Agenda items',
	})
	@Prop({
		type: [String],
		required: [true, 'Agenda is required'],
		validate: {
			validator: (v: string[]) => v.length > 0,
			message: 'At least one agenda item is required',
		},
	})
	agenda: string[];

	@ApiProperty({ example: 'Tech Corp', description: 'Organizer name' })
	@Prop({
		type: String,
		required: [true, 'Organizer is required'],
		trim: true,
	})
	organizer: string;

	@ApiProperty({ type: String, description: 'Organizer ID' })
	@Prop({ type: String, ref: 'User', required: false })
	organizerId: string;

	@ApiProperty({ example: ['tech', 'coding'], description: 'Tags' })
	@Prop({
		type: [String],
		required: [true, 'Tags are required'],
		validate: {
			validator: (v: string[]) => v.length > 0,
			message: 'At least one tag is required',
		},
	})
	tags: string[];
}

export type EventDocument = HydratedModel<Event>;
export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.index({ slug: 1 }, { unique: true });
EventSchema.index({ title: 'hashed' });
EventSchema.index({ date: 1 });
