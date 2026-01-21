import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { EventService } from './event.service';
import { Event } from './event.schema';
import { MinioService } from '../minio/minio.service';
import { CreateEventDto } from './dto/create-event.dto';

describe('EventService', () => {
	let service: EventService;
	let eventModel: Model<Event>;
	let minioService: MinioService;

	const mockEvent = {
		_id: 'event123',
		title: 'Test Event',
		description: 'Test Description',
		slug: 'test-event',
		date: new Date('2026-02-01'),
		location: 'Test Location',
		organizer: 'Test Organizer',
		organizerId: 'user123',
		mode: 'offline',
		tags: ['tech', 'conference'],
		agenda: [],
		image: 'test-image.jpg',
		maxAttendees: 100,
	};

	const mockEventModel = {
		find: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		countDocuments: jest.fn(),
	};

	const mockMinioService = {
		uploadFile: jest.fn(),
		getPresignedUrl: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				EventService,
				{
					provide: Event.name,
					useValue: mockEventModel,
				},
				{
					provide: MinioService,
					useValue: mockMinioService,
				},
			],
		}).compile();

		service = module.get<EventService>(EventService);
		eventModel = module.get<Model<Event>>(Event.name);
		minioService = module.get<MinioService>(MinioService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getAllEvents', () => {
		it('should return paginated events', async () => {
			const mockQuery = {
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue([mockEvent]),
			};

			mockEventModel.find.mockReturnValue(mockQuery);
			mockEventModel.countDocuments.mockResolvedValue(1);
			mockMinioService.getPresignedUrl.mockResolvedValue(
				'https://presigned-url.com/image.jpg',
			);

			const result = await service.getAllEvents({
				page: 1,
				limit: 9,
			});

			expect(result).toHaveProperty('events');
			expect(result).toHaveProperty('totalEvents', 1);
			expect(result).toHaveProperty('totalPages', 1);
			expect(result).toHaveProperty('currentPage', 1);
			expect(mockEventModel.find).toHaveBeenCalled();
		});

		it('should filter events by search query', async () => {
			const mockQuery = {
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue([]),
			};

			mockEventModel.find.mockReturnValue(mockQuery);
			mockEventModel.countDocuments.mockResolvedValue(0);

			await service.getAllEvents({
				page: 1,
				limit: 9,
				search: 'test',
			});

			expect(mockEventModel.find).toHaveBeenCalledWith(
				expect.objectContaining({
					$or: expect.arrayContaining([
						{ title: { $regex: 'test', $options: 'i' } },
					]),
				}),
			);
		});

		it('should filter events by tags', async () => {
			const mockQuery = {
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue([]),
			};

			mockEventModel.find.mockReturnValue(mockQuery);
			mockEventModel.countDocuments.mockResolvedValue(0);

			await service.getAllEvents({
				page: 1,
				limit: 9,
				tags: ['tech', 'conference'],
			});

			expect(mockEventModel.find).toHaveBeenCalledWith(
				expect.objectContaining({
					tags: { $in: ['tech', 'conference'] },
				}),
			);
		});

		it('should filter events by mode', async () => {
			const mockQuery = {
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue([]),
			};

			mockEventModel.find.mockReturnValue(mockQuery);
			mockEventModel.countDocuments.mockResolvedValue(0);

			await service.getAllEvents({
				page: 1,
				limit: 9,
				mode: 'online',
			});

			expect(mockEventModel.find).toHaveBeenCalledWith(
				expect.objectContaining({
					mode: 'online',
				}),
			);
		});
	});

	describe('getEventsByUser', () => {
		it('should return events created by a specific user', async () => {
			const mockQuery = {
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockReturnThis(),
				lean: jest.fn().mockResolvedValue([mockEvent]),
			};

			mockEventModel.find.mockReturnValue(mockQuery);
			mockEventModel.countDocuments.mockResolvedValue(1);
			mockMinioService.getPresignedUrl.mockResolvedValue(
				'https://presigned-url.com/image.jpg',
			);

			const result = await service.getEventsByUser('user123', {
				page: 1,
				limit: 9,
			});

			expect(result).toHaveProperty('events');
			expect(result.totalEvents).toBe(1);
			expect(mockEventModel.find).toHaveBeenCalledWith({
				organizerId: 'user123',
			});
		});
	});

	describe('createEvent', () => {
		const createEventDto: CreateEventDto = {
			title: 'New Event',
			description: 'New Description',
			slug: 'new-event',
			date: new Date('2026-03-01'),
			location: 'New Location',
			organizer: 'New Organizer',
			mode: 'offline',
			tags: ['tech'],
			agenda: [],
			maxAttendees: 50,
		};

		const mockFile = {
			fieldname: 'image',
			originalname: 'test.jpg',
			encoding: '7bit',
			mimetype: 'image/jpeg',
			buffer: Buffer.from('test'),
			size: 1024,
		} as Express.Multer.File;

		it('should throw ConflictException if slug already exists', async () => {
			mockEventModel.findOne.mockResolvedValue(mockEvent);

			await expect(
				service.createEvent(createEventDto, mockFile, 'user123'),
			).rejects.toThrow(ConflictException);
		});

		it('should call uploadFile when file is provided', async () => {
			mockEventModel.findOne.mockResolvedValue(null);
			mockMinioService.uploadFile.mockResolvedValue('uploaded-image.jpg');

			try {
				await service.createEvent(createEventDto, mockFile, 'user123');
			} catch (error) {
				// Expected to fail due to model constructor, but we can verify upload was called
			}

			expect(mockMinioService.uploadFile).toHaveBeenCalledWith(mockFile);
		});
	});

	describe('getEventById', () => {
		it('should return event by ID', async () => {
			const mockQuery = {
				lean: jest.fn().mockResolvedValue(mockEvent),
			};

			mockEventModel.findOne.mockReturnValue(mockQuery);
			mockMinioService.getPresignedUrl.mockResolvedValue(
				'https://presigned-url.com/image.jpg',
			);

			const result = await service.getEventById('event123');

			expect(result).toBeDefined();
			expect(mockEventModel.findOne).toHaveBeenCalledWith({
				$or: [{ _id: 'event123' }, { slug: 'event123' }],
			});
		});

		it('should return event by slug', async () => {
			const mockQuery = {
				lean: jest.fn().mockResolvedValue(mockEvent),
			};

			mockEventModel.findOne.mockReturnValue(mockQuery);
			mockMinioService.getPresignedUrl.mockResolvedValue(
				'https://presigned-url.com/image.jpg',
			);

			const result = await service.getEventById('test-event');

			expect(result).toBeDefined();
			expect(mockEventModel.findOne).toHaveBeenCalledWith({
				$or: [{ _id: 'test-event' }, { slug: 'test-event' }],
			});
		});

		it('should return null if event not found', async () => {
			const mockQuery = {
				lean: jest.fn().mockResolvedValue(null),
			};

			mockEventModel.findOne.mockReturnValue(mockQuery);

			const result = await service.getEventById('nonexistent');

			expect(result).toBeNull();
		});
	});
});
