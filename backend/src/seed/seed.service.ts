import { Injectable, Logger, Inject } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Event } from 'src/event/event.schema';
import { Booking } from 'src/booking/booking.schema';
import { MinioService } from 'src/minio/minio.service';
import { events as MOCK_EVENTS } from 'src/constants';
import * as fs from 'fs';
import { AuthService } from 'src/auth/auth.service';
import { RegisterUserDto } from 'src/auth/dto';

@Injectable()
export class SeedService {
	private readonly logger = new Logger(SeedService.name);

	private readonly toSHA256 = (
		input: string = Math.random().toString(),
	): string => {
		const crypto = require('crypto');
		return crypto.createHash('sha256').update(input).digest('hex');
	};

	constructor(
		@Inject(User.name) private userModel: Model<User>,
		@Inject(Event.name) private eventModel: Model<Event>,
		@Inject(Booking.name) private bookingModel: Model<Booking>,
		private readonly minioService: MinioService,
		private readonly authService: AuthService,
	) {}

	async seedDatabase() {
		const stats = { users: 0, events: 0 };

		try {
			// Clear existing data
			await this.userModel.deleteMany({});
			await this.eventModel.deleteMany({});
			await this.bookingModel.deleteMany({});
			this.logger.log('Cleared existing data');

			// Create sample organizers
			const organizers = await this.createOrganizers();
			stats.users = organizers.length;
			this.logger.log(`Created ${organizers.length} organizers`);

			// Create sample events
			const events = await this.createEvents(organizers);
			stats.events = events.length;
			this.logger.log(`Created ${events.length} events`);

			return {
				message: 'Database seeded successfully',
				stats,
			};
		} catch (error) {
			this.logger.error('Error seeding database:', error);
			throw error;
		}
	}

	private async createOrganizers(): Promise<any[]> {
		const organizers = [
			{
				fullName: 'John Doe',
				username: 'johndoe',
				email: 'john@example.com',
				password: '1234567890',
				role: 'organizer',
			},
			{
				fullName: 'Jane Smith',
				username: 'janesmith',
				email: 'jane@example.com',
				password: '1234567890',
				role: 'organizer',
			},
			{
				fullName: 'Vercel Team',
				username: 'vercelteam',
				email: 'team@vercel.com',
				password: '1234567890',
				role: 'organizer',
			},
			{
				fullName: 'React Community',
				username: 'reactcommunity',
				email: 'community@react.dev',
				password: '1234567890',
				role: 'organizer',
			},
		];

		const createdOrganizers: any[] = [];
		for (const organizerData of organizers) {
			const { user } = await this.authService.signUp(
				organizerData as RegisterUserDto,
			);
			createdOrganizers.push(user);
			this.logger.log(`Created organizer: ${organizerData.fullName}`);
		}

		return createdOrganizers;
	}

	private async createEvents(organizers: any[]): Promise<any[]> {
		const createdEvents: any[] = [];

		for (const eventData of MOCK_EVENTS) {
			try {
				// Get a random organizer
				const organizer =
					organizers[Math.floor(Math.random() * organizers.length)];

				// Handle image upload if exists
				let minioImageName = '';
				if (eventData.image) {
					if (
						fs.existsSync(
							`/Users/aditya/Programming/dev-event/frontend/public${eventData.image}`,
						)
					) {
						try {
							const imageBuffer = fs.readFileSync(
								`/Users/aditya/Programming/dev-event/frontend/public${eventData.image}`,
							);
							const mockFile = {
								originalname: eventData.image,
								buffer: imageBuffer,
								mimetype: 'image/jpeg',
							} as Express.Multer.File;
							minioImageName = await this.minioService.uploadFile(mockFile);
							this.logger.log(`Uploaded image: ${eventData.image}`);
						} catch (uploadError) {
							this.logger.warn(
								`Failed to upload image ${eventData.image}:`,
								uploadError,
							);
						}
					} else {
						this.logger.warn(
							`Image file not found: /Users/aditya/Programming/dev-event/frontend/public${eventData.image}`,
						);
					}
				}

				// Only get presigned URL if we have a valid image name
				const event = await this.eventModel.create({
					...eventData,
					image: minioImageName,
					organizer: organizer._id as Types.ObjectId,
				});

				createdEvents.push(event);
				this.logger.log(`Created event: ${eventData.title}`);
			} catch (error) {
				this.logger.error(`Failed to create event: ${eventData.title}`, error);
			}
		}

		return createdEvents;
	}
}
