import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Event } from '../event/event.schema';
import { Booking } from '../booking/booking.schema';
import { EventStatsDto, OrganizerStatsDto } from './dto/analytics.dto';

@Injectable()
export class AnalyticsService {
	constructor(
		@Inject(Event.name) private eventModel: Model<Event>,
		@Inject(Booking.name) private bookingModel: Model<Booking>,
	) {}
	private readonly logger = new Logger(AnalyticsService.name);

	async getEventStats(eventId: string): Promise<EventStatsDto> {
		const event = await this.eventModel
			.findOne({
				$or: [{ _id: eventId }, { slug: eventId }],
			})
			.populate({
				path: 'organizer',
				select: 'fullName username email avatar roles',
			});

		if (!event) {
			throw new NotFoundException('Event not found');
		}

		const totalBookings = await this.bookingModel.countDocuments({
			eventId: event._id,
		} as any);
		const totalCheckIns = await this.bookingModel.countDocuments({
			eventId: event._id,
			checkedInAt: { $exists: true, $ne: null },
		} as any);

		// Get bookings over the last 7 days
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const bookingsByDay = await this.bookingModel.aggregate([
			{
				$match: {
					eventId: event._id,
					createdAt: { $gte: sevenDaysAgo },
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		return {
			totalBookings,
			totalCheckIns,
			checkInRate:
				totalBookings > 0 ? (totalCheckIns / totalBookings) * 100 : 0,
			bookingsByDay: bookingsByDay.map((b) => ({
				date: b._id,
				count: b.count,
			})),
		};
	}

	async getOrganizerStats(userId: string): Promise<OrganizerStatsDto> {
		// Validate userId is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			throw new NotFoundException('Invalid user ID provided');
		}

		const events = await this.eventModel
			.find({
				organizer: new mongoose.Types.ObjectId(userId),
			})
			.populate({
				path: 'organizer',
				select: 'fullName username email avatar roles',
			})
			.catch((error) => {
				this.logger.error('Error querying organizer events:', error);
				// Return empty array on error
				return [];
			});
		const eventIds = events.map((e) => e._id);

		const totalEvents = events.length;
		const totalBookings = await this.bookingModel.countDocuments({
			eventId: { $in: eventIds },
		} as any);
		const totalCheckIns = await this.bookingModel.countDocuments({
			eventId: { $in: eventIds },
			checkedInAt: { $exists: true, $ne: null },
		} as any);

		// Top events by bookings
		const topEvents = await this.bookingModel.aggregate([
			{ $match: { eventId: { $in: eventIds } } },
			{ $group: { _id: '$eventId', bookings: { $sum: 1 } } },
			{ $sort: { bookings: -1 } },
			{ $limit: 5 },
			{
				$lookup: {
					from: 'events',
					localField: '_id',
					foreignField: '_id',
					as: 'eventInfo',
				},
			},
			{ $unwind: '$eventInfo' },
			{
				$lookup: {
					from: 'users',
					localField: 'eventInfo.organizer',
					foreignField: '_id',
					as: 'organizerInfo',
				},
			},
			{ $unwind: '$organizerInfo' },
			{
				$project: {
					title: '$eventInfo.title',
					bookings: 1,
					organizer: {
						fullName: '$organizerInfo.fullName',
						username: '$organizerInfo.username',
						email: '$organizerInfo.email',
						avatar: '$organizerInfo.avatar',
						roles: '$organizerInfo.roles',
					},
				},
			},
		]);

		return {
			totalEvents,
			totalBookings,
			totalCheckIns,
			topEvents: topEvents.map((te) => ({
				title: te.title,
				bookings: te.bookings,
				organizer: te.organizer,
			})),
		};
	}
}
