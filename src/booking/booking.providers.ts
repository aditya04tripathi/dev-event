import { Connection } from 'mongoose';
import { Booking, BookingSchema } from './booking.schema';

export const bookingProviders = [
	{
		provide: Booking.name,
		useFactory: (connection: Connection) =>
			connection.model(Booking.name, BookingSchema),
		inject: ['DATABASE_CONNECTION'],
	},
];
