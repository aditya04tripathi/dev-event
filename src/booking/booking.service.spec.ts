import { Test, TestingModule } from '@nestjs/testing';
import {
	ConflictException,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { BookingService } from './booking.service';
import { Booking } from './booking.schema';
import { EventService } from '../event/event.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CheckInDto } from './dto/check-in.dto';
import * as encryption from '../utils/encryption.util';

describe('BookingService', () => {
	let service: BookingService;
	let bookingModel: Model<Booking>;
	let eventService: EventService;

	const mockEvent = {
		_id: 'event123',
		title: 'Test Event',
		slug: 'test-event',
		date: new Date('2026-02-01'),
		location: 'Test Location',
	};

	const mockBooking = {
		_id: 'booking123',
		eventId: 'event123',
		name: 'Test User',
		email: 'test@example.com',
		createdAt: new Date(),
		toObject: jest.fn().mockReturnThis(),
	};

	const mockBookingModel = {
		findOne: jest.fn(),
		findById: jest.fn(),
		create: jest.fn(),
	};

	const mockEventService = {
		getEventById: jest.fn(),
	};

	beforeEach(async () => {
		// Mock encryption utilities
		jest.spyOn(encryption, 'encryptData').mockReturnValue('encrypted-data');
		jest.spyOn(encryption, 'decryptData').mockReturnValue('decrypted-data');

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BookingService,
				{
					provide: Booking.name,
					useValue: mockBookingModel,
				},
				{
					provide: EventService,
					useValue: mockEventService,
				},
			],
		}).compile();

		service = module.get<BookingService>(BookingService);
		bookingModel = module.get<Model<Booking>>(Booking.name);
		eventService = module.get<EventService>(EventService);
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	describe('createBooking', () => {
		const createBookingDto: CreateBookingDto = {
			name: 'Test User',
			email: 'test@example.com',
		};

		it('should create a booking successfully', async () => {
			mockEventService.getEventById.mockResolvedValue(mockEvent);
			mockBookingModel.findOne.mockResolvedValue(null);
			mockBookingModel.create.mockResolvedValue(mockBooking);
			(encryption.encryptData as jest.Mock).mockReturnValue('encrypted-data');

			const result = await service.createBooking('event123', createBookingDto);

			expect(result).toHaveProperty('qrCode');
			expect(mockEventService.getEventById).toHaveBeenCalledWith('event123');
			expect(mockBookingModel.findOne).toHaveBeenCalledWith({
				eventId: mockEvent._id,
				email: createBookingDto.email,
			});
			expect(mockBookingModel.create).toHaveBeenCalledWith({
				eventId: mockEvent._id,
				name: createBookingDto.name,
				email: createBookingDto.email,
			});
		});

		it('should throw NotFoundException if event not found', async () => {
			mockEventService.getEventById.mockResolvedValue(null);

			await expect(
				service.createBooking('nonexistent', createBookingDto),
			).rejects.toThrow(NotFoundException);
		});

		it('should throw ConflictException if booking already exists', async () => {
			mockEventService.getEventById.mockResolvedValue(mockEvent);
			mockBookingModel.findOne.mockResolvedValue(mockBooking);

			await expect(
				service.createBooking('event123', createBookingDto),
			).rejects.toThrow(ConflictException);
		});

		it('should generate QR code with correct data', async () => {
			mockEventService.getEventById.mockResolvedValue(mockEvent);
			mockBookingModel.findOne.mockResolvedValue(null);
			mockBookingModel.create.mockResolvedValue(mockBooking);
			(encryption.encryptData as jest.Mock).mockReturnValue('encrypted-data');

			await service.createBooking('event123', createBookingDto);

			expect(encryption.encryptData).toHaveBeenCalledWith(
				expect.stringContaining('"bookingId":"booking123"'),
			);
			expect(encryption.encryptData).toHaveBeenCalledWith(
				expect.stringContaining('"eventId":"event123"'),
			);
		});
	});

	describe('checkIn', () => {
		const checkInDto: CheckInDto = {
			qrData: 'encrypted-qr-data',
		};

		const decryptedData = {
			bookingId: 'booking123',
			eventId: 'event123',
			eventTitle: 'Test Event',
			name: 'Test User',
			email: 'test@example.com',
			timestamp: new Date().toISOString(),
		};

		it('should check in successfully with valid QR code', async () => {
			mockEventService.getEventById.mockResolvedValue(mockEvent);
			(encryption.decryptData as jest.Mock).mockReturnValue(
				JSON.stringify(decryptedData),
			);
			mockBookingModel.findById.mockResolvedValue(mockBooking);

			const result = await service.checkIn('event123', checkInDto);

			expect(result).toHaveProperty('id', 'booking123');
			expect(result).toHaveProperty('name', 'Test User');
			expect(result).toHaveProperty('email', 'test@example.com');
			expect(result).toHaveProperty('checkedInAt');
			expect(mockEventService.getEventById).toHaveBeenCalledWith('event123');
		});

		it('should throw NotFoundException if event not found', async () => {
			mockEventService.getEventById.mockResolvedValue(null);

			await expect(service.checkIn('nonexistent', checkInDto)).rejects.toThrow(
				NotFoundException,
			);
		});

		it('should throw BadRequestException if QR code is invalid', async () => {
			mockEventService.getEventById.mockResolvedValue(mockEvent);
			(encryption.decryptData as jest.Mock).mockImplementation(() => {
				throw new Error('Decryption failed');
			});

			await expect(service.checkIn('event123', checkInDto)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw BadRequestException if QR code event mismatch', async () => {
			mockEventService.getEventById.mockResolvedValue(mockEvent);
			(encryption.decryptData as jest.Mock).mockReturnValue(
				JSON.stringify({
					...decryptedData,
					eventId: 'different-event',
				}),
			);

			await expect(service.checkIn('event123', checkInDto)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw NotFoundException if booking not found', async () => {
			mockEventService.getEventById.mockResolvedValue(mockEvent);
			(encryption.decryptData as jest.Mock).mockReturnValue(
				JSON.stringify(decryptedData),
			);
			mockBookingModel.findById.mockResolvedValue(null);

			await expect(service.checkIn('event123', checkInDto)).rejects.toThrow(
				NotFoundException,
			);
		});

		it('should throw BadRequestException if booking event mismatch', async () => {
			mockEventService.getEventById.mockResolvedValue(mockEvent);
			(encryption.decryptData as jest.Mock).mockReturnValue(
				JSON.stringify(decryptedData),
			);
			mockBookingModel.findById.mockResolvedValue({
				...mockBooking,
				eventId: 'different-event',
			});

			await expect(service.checkIn('event123', checkInDto)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw BadRequestException if email mismatch', async () => {
			mockEventService.getEventById.mockResolvedValue(mockEvent);
			(encryption.decryptData as jest.Mock).mockReturnValue(
				JSON.stringify(decryptedData),
			);
			mockBookingModel.findById.mockResolvedValue({
				...mockBooking,
				email: 'different@example.com',
			});

			await expect(service.checkIn('event123', checkInDto)).rejects.toThrow(
				BadRequestException,
			);
		});
	});
});
