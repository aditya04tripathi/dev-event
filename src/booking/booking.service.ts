import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Booking } from './booking.schema';
import { EventService } from '../event/event.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { encryptData, decryptData } from '../utils/encryption.util';
import * as QRCode from 'qrcode';
import { CheckInDto } from './dto/check-in.dto';

@Injectable()
export class BookingService {
	constructor(
		@Inject(Booking.name) private bookingModel: Model<Booking>,
		private readonly eventService: EventService,
	) {}

	async createBooking(
		eventIdOrSlug: string,
		createBookingDto: CreateBookingDto,
	) {
		const event = await this.eventService.getEventById(eventIdOrSlug);
		if (!event) {
			throw new NotFoundException('Event not found');
		}

		const existingBooking = await this.bookingModel.findOne({
			eventId: event._id,
			email: createBookingDto.email,
		});

		if (existingBooking) {
			throw new ConflictException('You have already booked this event');
		}

		const booking = await this.bookingModel.create({
			eventId: event._id,
			name: createBookingDto.name,
			email: createBookingDto.email,
		});

		const qrCodeBase64 = await this.generateQRCode(booking, event);

		return {
			...booking.toObject(),
			qrCode: qrCodeBase64,
		};
	}

	private async generateQRCode(booking: any, event: any) {
		const qrData = JSON.stringify({
			bookingId: booking._id.toString(),
			eventId: event._id.toString(),
			eventTitle: event.title,
			name: booking.name,
			email: booking.email,
			timestamp: booking.createdAt.toISOString(),
		});

		const encryptedData = encryptData(qrData);

		return await QRCode.toDataURL(encryptedData, {
			errorCorrectionLevel: 'H',
			type: 'image/png',
			width: 300,
			margin: 2,
		});
	}

	async checkIn(eventIdOrSlug: string, checkInDto: CheckInDto) {
		const event = await this.eventService.getEventById(eventIdOrSlug);
		if (!event) {
			throw new NotFoundException('Event not found');
		}

		let decryptedData: any;
		try {
			const decrypted = decryptData(checkInDto.qrData);
			decryptedData = JSON.parse(decrypted);
		} catch {
			throw new BadRequestException('Invalid QR code format');
		}

		if (decryptedData.eventId !== event._id.toString()) {
			throw new BadRequestException('QR code does not match this event');
		}

		const booking = await this.bookingModel.findById(decryptedData.bookingId);
		if (!booking) {
			throw new NotFoundException('Booking not found');
		}

		if (booking.checkedInAt) {
			throw new ConflictException('Attendee already checked in');
		}

		if ((booking.eventId as any).toString() !== event._id.toString()) {
			throw new BadRequestException('Booking does not match this event');
		}

		if (booking.email !== decryptedData.email) {
			throw new BadRequestException('Email mismatch');
		}

		booking.checkedInAt = new Date();
		await booking.save();

		return {
			id: booking._id.toString(),
			name: booking.name,
			email: booking.email,
			eventTitle: event.title,
			checkedInAt: booking.checkedInAt.toISOString(),
		};
	}

	async getEventParticipants(
		eventIdOrSlug: string,
		userId: string,
		query: { page?: number; limit?: number; search?: string },
	) {
		const event = await this.eventService.getEventById(eventIdOrSlug);
		if (!event) {
			throw new NotFoundException('Event not found');
		}

		// Authorization is handled by OrganizerGuard in controller, but double check
		if (event.organizerId?.toString() !== userId) {
			throw new ConflictException('Unauthorized access to participants');
		}

		const pageNum = Math.max(1, Number(query.page) || 1);
		const limitNum = Math.max(1, Number(query.limit) || 10);
		const skip = (pageNum - 1) * limitNum;

		const filter: any = { eventId: event._id };
		if (query.search) {
			filter.$or = [
				{ name: { $regex: query.search, $options: 'i' } },
				{ email: { $regex: query.search, $options: 'i' } },
			];
		}

		const participants = await this.bookingModel
			.find(filter)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limitNum)
			.lean();

		const totalParticipants = await this.bookingModel.countDocuments(filter);

		return {
			participants,
			totalParticipants,
			currentPage: pageNum,
			totalPages: Math.ceil(totalParticipants / limitNum),
		};
	}

	async removeParticipant(eventId: string, bookingId: string, userId: string) {
		const event = await this.eventService.getEventById(eventId);
		if (!event) throw new NotFoundException('Event not found');

		if (event.organizerId?.toString() !== userId) {
			throw new ConflictException('Unauthorized action');
		}

		const booking = await this.bookingModel.findOne({
			_id: bookingId,
			eventId: event._id,
		});

		if (!booking) {
			throw new NotFoundException('Booking not found for this event');
		}

		await this.bookingModel.findByIdAndDelete(bookingId);
		return { message: 'Participant removed successfully' };
	}

	async resendQRCode(eventId: string, email: string, userId: string) {
		const event = await this.eventService.getEventById(eventId);
		if (!event) throw new NotFoundException('Event not found');

		if (event.organizerId?.toString() !== userId) {
			throw new ConflictException('Unauthorized action');
		}

		const booking = await this.bookingModel.findOne({
			eventId: event._id,
			email: email.toLowerCase(),
		});

		if (!booking) {
			throw new NotFoundException('Booking not found for this user');
		}

		const qrCodeBase64 = await this.generateQRCode(booking, event);

		return {
			...booking.toObject(),
			qrCode: qrCodeBase64,
		};
	}
}
