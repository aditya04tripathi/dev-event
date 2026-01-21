import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	NotFoundException,
	Inject,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Event } from 'src/event/event.schema';

@Injectable()
export class OrganizerGuard implements CanActivate {
	constructor(@Inject(Event.name) private eventModel: Model<Event>) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		const eventId = request.params.id;

		if (!user) {
			throw new ForbiddenException('User not authenticated');
		}

		if (!eventId) {
			return true;
		}

		const event = await this.eventModel.findOne({
			$or: [{ _id: eventId }, { slug: eventId }],
		});

		if (!event) {
			throw new NotFoundException('Event not found');
		}

		const userId = user._id?.toString() || user.id?.toString();
		const organizerId = event.organizerId?.toString();

		if (userId !== organizerId) {
			throw new ForbiddenException(
				'You do not have permission to modify this event',
			);
		}

		return true;
	}
}
