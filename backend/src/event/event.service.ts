import { Inject, Injectable, ConflictException, Logger } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Event } from './event.schema';
import { MinioService } from 'src/minio/minio.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
	constructor(
		@Inject(Event.name) private eventModel: Model<Event>,
		private readonly minioService: MinioService,
	) {}

	private logger = new Logger(EventService.name);

	async getAllEvents({
		page = 1,
		limit = 9,
		sort,
		search,
		tags,
		mode,
		organizer,
	}: {
		page?: number | string;
		limit?: number | string;
		sort?: 'asc' | 'desc';
		search?: string;
		tags?: string[] | string;
		mode?: 'online' | 'offline' | 'hybrid';
		organizer?: string;
	}) {
		const pageNum = Math.max(1, Number(page) || 1);
		const limitNum = Math.max(1, Number(limit) || 9);
		const query: Record<string, any> = {};

		if (organizer) {
			if (mongoose.Types.ObjectId.isValid(organizer)) {
				query.organizer = new mongoose.Types.ObjectId(organizer);
			} else {
				this.logger.warn(`Invalid organizer ObjectId provided: ${organizer}`);
			}
		}

		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
				{ location: { $regex: search, $options: 'i' } },
			];
		}

		if (tags) {
			const tagArray = Array.isArray(tags)
				? tags
				: tags.split(',').filter(Boolean);
			if (tagArray.length > 0) {
				query.tags = { $in: tagArray };
			}
		}

		if (mode) {
			query.mode = mode;
		}

		const skip = (pageNum - 1) * limitNum;
		const totalEvents = await this.eventModel.countDocuments(query);

		const sortOption = sort === 'desc' ? { date: -1 } : { date: 1 };

		let events;
		try {
			events = await this.eventModel
				.find(query)
				.sort(sortOption as any)
				.skip(skip)
				.limit(limitNum)
				.populate({
					path: 'organizer',
					select: 'fullName username email avatar roles',
				})
				.lean();
		} catch (error) {
			this.logger.error('Error querying events with population:', error);
			events = await this.eventModel
				.find(query)
				.sort(sortOption as any)
				.skip(skip)
				.limit(limitNum)
				.lean();
		}

		events = await Promise.all(events.map((e) => this.mapEventImage(e)));

		const totalPages = Math.ceil(totalEvents / limitNum);

		return {
			events,
			total: totalEvents,
			totalPages,
			currentPage: pageNum,
			nextPage: pageNum < totalPages ? pageNum + 1 : null,
			prevPage: pageNum > 1 ? pageNum - 1 : null,
			limit: limitNum,
			skip: skip,
		};
	}

	async getEventsByUser(
		userId: string,
		{
			page = 1,
			limit = 9,
		}: {
			page?: number | string;
			limit?: number | string;
		},
	) {
		this.logger.log('getEventsByUser', userId);

		const pageNum = Math.max(1, Number(page) || 1);
		const limitNum = Math.max(1, Number(limit) || 9);

		const query: Record<string, any> = {
			organizer: new mongoose.Types.ObjectId(userId),
		};

		const skip = (pageNum - 1) * limitNum;
		const totalEvents = await this.eventModel.countDocuments(query);

		this.logger.log(totalEvents);

		let events;
		try {
			events = await this.eventModel
				.find(query)
				.sort({ date: 1 })
				.skip(skip)
				.limit(limitNum)
				.populate({
					path: 'organizer',
					select: 'fullName username email avatar roles',
				})
				.lean();
		} catch (error) {
			this.logger.error('Error querying user events with population:', error);
			// Fallback: get events without population
			events = await this.eventModel
				.find(query)
				.sort({ date: 1 })
				.skip(skip)
				.limit(limitNum)
				.lean();
		}

		events = await Promise.all(events.map((e) => this.mapEventImage(e)));

		const totalPages = Math.ceil(totalEvents / limitNum);

		return {
			data: events,
			total: totalEvents,
			totalPages,
			currentPage: pageNum,
			nextPage: pageNum < totalPages ? pageNum + 1 : null,
			prevPage: pageNum > 1 ? pageNum - 1 : null,
			limit: limitNum,
			skip: skip,
		};
	}

	async createEvent(
		createEventDto: CreateEventDto,
		file: Express.Multer.File,
		userId: string,
	) {
		// Validate userId is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			throw new ConflictException('Invalid user ID provided');
		}
		let imageUrl = '';
		if (file) {
			imageUrl = await this.minioService.uploadFile(file);
		}

		let tags = createEventDto.tags;
		if (typeof tags === 'string') {
			try {
				tags = JSON.parse(tags);
			} catch {
				// ignore parsing error
			}
		}

		let agenda = createEventDto.agenda;
		if (typeof agenda === 'string') {
			try {
				agenda = JSON.parse(agenda);
			} catch {
				// ignore parsing error
			}
		}

		const existingEvent = await this.eventModel.findOne({
			slug: createEventDto.slug,
		});
		if (existingEvent) {
			throw new ConflictException('An event with this slug already exists');
		}

		const event = new this.eventModel({
			...createEventDto,
			image: imageUrl,
			tags,
			agenda,
			organizer: new mongoose.Types.ObjectId(userId),
		});

		return await event.save();
	}

	async getEventById(id: string) {
		const isObjectId = mongoose.Types.ObjectId.isValid(id);
		const query = isObjectId
			? { $or: [{ _id: new mongoose.Types.ObjectId(id) }, { slug: id }] }
			: { slug: id };

		let event;
		try {
			event = await this.eventModel
				.findOne(query)
				.populate({
					path: 'organizer',
					select: 'fullName username email avatar roles',
				})
				.lean();
		} catch (error) {
			this.logger.error('Error getting event with population:', error);
			// Fallback: get event without population
			event = await this.eventModel.findOne(query).lean();
		}

		if (!event) return null;

		return event;
	}

	async updateEvent(
		eventId: string,
		userId: string,
		updateEventDto: UpdateEventDto,
		file?: Express.Multer.File,
	) {
		const isObjectId = mongoose.Types.ObjectId.isValid(eventId);
		const event = await this.eventModel.findOne({
			$or: [
				...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(eventId) }] : []),
				{ slug: eventId },
			],
		});

		if (!event) {
			throw new ConflictException('Event not found');
		}

		const updateData: any = { ...updateEventDto };

		if (file) {
			const imageUrl = await this.minioService.uploadFile(file);
			updateData.image = imageUrl;
		}

		if (updateEventDto.tags && typeof updateEventDto.tags === 'string') {
			try {
				updateData.tags = JSON.parse(updateEventDto.tags);
			} catch {
				// ignore parsing error
			}
		}

		if (updateEventDto.agenda && typeof updateEventDto.agenda === 'string') {
			try {
				updateData.agenda = JSON.parse(updateEventDto.agenda);
			} catch {
				// ignore parsing error
			}
		}

		if (updateEventDto.slug && updateEventDto.slug !== event.slug) {
			const existingEvent = await this.eventModel.findOne({
				slug: updateEventDto.slug,
			});
			if (existingEvent) {
				throw new ConflictException('An event with this slug already exists');
			}
		}

		const updatedEvent = await this.eventModel
			.findByIdAndUpdate(event._id, updateData, { new: true })
			.populate({
				path: 'organizer',
				select: 'fullName username email avatar roles',
			})
			.lean()
			.catch((error) => {
				this.logger.error('Error updating event with population:', error);
				return this.eventModel
					.findByIdAndUpdate(event._id, updateData, { new: true })
					.lean();
			});

		return updatedEvent;
	}

	async deleteEvent(eventId: string, userId: string) {
		const isObjectId = mongoose.Types.ObjectId.isValid(eventId);
		const event = await this.eventModel.findOne({
			$or: [
				...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(eventId) }] : []),
				{ slug: eventId },
			],
		});

		if (!event) {
			throw new ConflictException('Event not found');
		}

		await this.eventModel.findByIdAndDelete(event._id);

		return { message: 'Event deleted successfully' };
	}

	private async mapEventImage(event: any) {
		if (event.image && !event.image.startsWith('http')) {
			try {
				event.image = await this.minioService.getFileUrl(event.image);
			} catch (error) {
				this.logger.warn(
					`Failed to generate URL for image ${event.image}`,
					error,
				);
			}
		}
		return event;
	}
}
