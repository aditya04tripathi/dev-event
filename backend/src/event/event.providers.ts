import { Connection } from 'mongoose';
import { Event, EventSchema } from './event.schema';

export const eventProviders = [
	{
		provide: Event.name,
		useFactory: (connection: Connection) =>
			connection.model(Event.name, EventSchema),
		inject: ['DATABASE_CONNECTION'],
	},
];
