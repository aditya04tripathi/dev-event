import { ApiProperty } from '@nestjs/swagger';

export class EventStatsDto {
	@ApiProperty({ example: 150, description: 'Total number of bookings' })
	totalBookings: number;

	@ApiProperty({ example: 120, description: 'Total number of check-ins' })
	totalCheckIns: number;

	@ApiProperty({ example: 0.8, description: 'Check-in rate as decimal' })
	checkInRate: number;

	@ApiProperty({
		type: [Object],
		description: 'Bookings over the last 7 days',
		example: [
			{ date: '2024-01-01', count: 10 },
			{ date: '2024-01-02', count: 15 },
		],
	})
	bookingsByDay: { date: string; count: number }[];
}

export class OrganizerStatsDto {
	@ApiProperty({ example: 5, description: 'Total events organized' })
	totalEvents: number;

	@ApiProperty({
		example: 250,
		description: 'Total bookings across all events',
	})
	totalBookings: number;

	@ApiProperty({
		example: 200,
		description: 'Total check-ins across all events',
	})
	totalCheckIns: number;

	@ApiProperty({
		type: [Object],
		description: 'Top performing events with organizer details',
		example: [
			{
				title: 'Tech Conference 2024',
				bookings: 150,
				organizer: {
					fullName: 'John Doe',
					username: 'johndoe',
					email: 'john@example.com',
					avatar: 'https://gravatar.com/avatar/xyz',
					roles: ['organizer'],
				},
			},
		],
	})
	topEvents: {
		title: string;
		bookings: number;
		organizer?: {
			fullName: string;
			username: string;
			email: string;
			avatar: string;
			roles: string[];
		};
	}[];
}
