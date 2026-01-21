import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedModel } from 'src/types';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Booking {
	@ApiProperty({ description: 'Event ID' })
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
	eventId: MongooseSchema.Types.ObjectId;

	@ApiProperty({ example: 'John Doe', description: 'Name of the attendee' })
	@Prop({ required: true, trim: true })
	name: string;

	@ApiProperty({
		example: 'john@example.com',
		description: 'Email of the attendee',
	})
	@Prop({ required: true, trim: true, lowercase: true })
	email: string;

	@ApiProperty({ required: false, description: 'Check-in timestamp' })
	@Prop({ type: Date, required: false })
	checkedInAt?: Date;

	createdAt: Date;
	updatedAt: Date;
}

export type BookingDocument = HydratedModel<Booking>;
export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });
