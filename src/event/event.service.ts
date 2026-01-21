import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Event } from './event.schema';
import { MinioService } from 'src/minio/minio.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
	constructor(
		@Inject(Event.name) private eventModel: Model<Event>,
		private readonly minioService: MinioService,
	) {}

	private async mapEventImage(event: any) {
		if (event.image && !event.image.startsWith('http')) {
			event.image = await this.minioService.getPresignedUrl(event.image);
		}
		return event;
	}

	async getAllEvents({
		page = 1,
		limit = 9,
		sort,
		search,
		tags,
		mode,
	}: {
		page?: number | string;
		limit?: number | string;
		sort?: 'asc' | 'desc';
		search?: string;
		tags?: string[] | string;
		mode?: 'online' | 'offline' | 'hybrid';
	}) {
		const pageNum = Math.max(1, Number(page) || 1);
		const limitNum = Math.max(1, Number(limit) || 9);
		const query: Record<string, any> = {};

		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
				{ location: { $regex: search, $options: 'i' } },
				{ organizer: { $regex: search, $options: 'i' } },
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

		let events = await this.eventModel
			.find(query)
			.sort(sortOption as any)
			.skip(skip)
			.limit(limitNum)
			.lean();

		events = await Promise.all(events.map((e) => this.mapEventImage(e)));

		const totalPages = Math.ceil(totalEvents / limitNum);

		return {
			events,
			totalEvents,
			totalPages,
			currentPage: pageNum,
			nextPage: pageNum < totalPages ? pageNum + 1 : null,
			prevPage: pageNum > 1 ? pageNum - 1 : null,
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
		const pageNum = Math.max(1, Number(page) || 1);
		const limitNum = Math.max(1, Number(limit) || 9);
		const query: Record<string, any> = { organizerId: userId };

		const skip = (pageNum - 1) * limitNum;
		const totalEvents = await this.eventModel.countDocuments(query);

		let events = await this.eventModel
			.find(query)
			.sort({ date: 1 })
			.skip(skip)
			.limit(limitNum)
			.lean();

		events = await Promise.all(events.map((e) => this.mapEventImage(e)));

		const totalPages = Math.ceil(totalEvents / limitNum);

		return {
			events,
			totalEvents,
			totalPages,
			currentPage: pageNum,
			nextPage: pageNum < totalPages ? pageNum + 1 : null,
			prevPage: pageNum > 1 ? pageNum - 1 : null,
		};
	}

	async createEvent(
		createEventDto: CreateEventDto,
		file: Express.Multer.File,
		userId: string,
	) {
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
			organizerId: userId,
		});

		return await event.save();
	}

	async getEventById(id: string) {
		const query = this.eventModel.findOne({
			$or: [{ _id: id }, { slug: id }],
		});
		const event = await query.lean();
		if (!event) return null;

		return await this.mapEventImage(event);
	}

	async updateEvent(
		eventId: string,
		userId: string,
		updateEventDto: any,
		file?: Express.Multer.File,
	) {
		const event = await this.eventModel.findOne({
			$or: [{ _id: eventId }, { slug: eventId }],
		});

		if (!event) {
			throw new ConflictException('Event not found');
		}

		if (event.organizerId?.toString() !== userId) {
			throw new ConflictException(
				'You do not have permission to update this event',
			);
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
			.lean();

		return await this.mapEventImage(updatedEvent);
	}

	async deleteEvent(eventId: string, userId: string) {
		const event = await this.eventModel.findOne({
			$or: [{ _id: eventId }, { slug: eventId }],
		});

		if (!event) {
			throw new ConflictException('Event not found');
		}

		if (event.organizerId?.toString() !== userId) {
			throw new ConflictException(
				'You do not have permission to delete this event',
			);
		}

		await this.eventModel.findByIdAndDelete(event._id);

		return { message: 'Event deleted successfully' };
	}
}
