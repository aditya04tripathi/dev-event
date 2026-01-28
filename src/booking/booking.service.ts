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

	async scanTicket(eventIdOrSlug: string, checkInDto: CheckInDto) {
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

		if ((booking.eventId as any).toString() !== event._id.toString()) {
			throw new BadRequestException('Booking does not match this event');
		}

		if (booking.email !== decryptedData.email) {
			throw new BadRequestException('Email mismatch');
		}

		return {
			id: booking._id.toString(),
			name: booking.name,
			email: booking.email,
			eventTitle: event.title,
			isAlreadyCheckedIn: !!booking.checkedInAt,
			checkedInAt: booking.checkedInAt?.toISOString(),
			bookedAt: booking.createdAt.toISOString(),
		};
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

	async getBookingById(eventIdOrSlug: string, bookingId: string) {
		const event = await this.eventService.getEventById(eventIdOrSlug);
		if (!event) {
			throw new NotFoundException('Event not found');
		}

		const booking = await this.bookingModel.findOne({
			_id: bookingId,
			eventId: event._id,
		});

		if (!booking) {
			throw new NotFoundException('Booking not found for this event');
		}

		return {
			id: booking._id.toString(),
			name: booking.name,
			email: booking.email,
			eventTitle: event.title,
			isAlreadyCheckedIn: !!booking.checkedInAt,
			checkedInAt: booking.checkedInAt?.toISOString(),
			bookedAt: booking.createdAt.toISOString(),
		};
	}

	async removeParticipant(eventId: string, bookingId: string, userId: string) {
		const event = await this.eventService.getEventById(eventId);
		if (!event) throw new NotFoundException('Event not found');

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

	async getUserBookings(email: string) {
		const bookings = await this.bookingModel
			.find({ email: email.toLowerCase() })
			.populate('eventId', 'title date location slug image')
			.sort({ createdAt: -1 })
			.exec();

		return bookings.filter((b) => b.eventId); // Filter out bookings where event might be deleted
	}

	async getBookingTicket(bookingId: string, email: string) {
		const booking = await this.bookingModel
			.findOne({ _id: bookingId, email: email.toLowerCase() })
			.populate('eventId', 'title date location slug')
			.exec();

		if (!booking) {
			throw new NotFoundException('Booking not found');
		}

		if (!booking.eventId) {
			throw new NotFoundException('Event not found');
		}

		const event = booking.eventId as any;
		const qrCodeBase64 = await this.generateQRCode(booking, event);

		return {
			...booking.toObject(),
			qrCode: qrCodeBase64,
			eventTitle: event.title,
			eventDate: event.date,
			eventLocation: event.location,
		};
	}

	async generateIcsFile(bookingId: string, email: string) {
		const booking = await this.bookingModel
			.findOne({ _id: bookingId, email: email.toLowerCase() })
			.populate('eventId', 'title date location description')
			.exec();

		if (!booking || !booking.eventId) {
			throw new NotFoundException('Booking or Event not found');
		}

		const event = booking.eventId as any;
		const startDate = new Date(event.date);
		const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour duration

		const formatDate = (date: Date) => {
			return date.toISOString().replace(/-|:|\.\d+/g, '');
		};

		const icsContent = [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'PRODID:-//DevEvent//NONSGML Event//EN',
			'BEGIN:VEVENT',
			`UID:${booking._id}@devevent.com`,
			`DTSTAMP:${formatDate(new Date())}`,
			`DTSTART:${formatDate(startDate)}`,
			`DTEND:${formatDate(endDate)}`,
			`SUMMARY:${event.title}`,
			`DESCRIPTION:${event.description || 'Join us for this amazing event!'}`,
			`LOCATION:${event.location}`,
			'END:VEVENT',
			'END:VCALENDAR',
		].join('\r\n');

		return icsContent;
	}

	async exportBookingsCsv(eventId: string, userId: string) {
		const event = await this.eventService.getEventById(eventId);
		if (!event) throw new NotFoundException('Event not found');

		if (event.organizerId?.toString() !== userId) {
			throw new ConflictException('Unauthorized action');
		}

		const bookings = await this.bookingModel
			.find({ eventId: event._id })
			.sort({ createdAt: -1 });

		const header = 'Name,Email,Checked In,Registration Date\n';
		const rows = bookings
			.map((b) => {
				const checkedIn = b.checkedInAt ? 'Yes' : 'No';
				const date = new Date(b.createdAt).toLocaleDateString();
				return `"${b.name}","${b.email}",${checkedIn},${date}`;
			})
			.join('\n');

		return header + rows;
	}
}
