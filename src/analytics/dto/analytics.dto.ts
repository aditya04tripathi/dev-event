import { ApiProperty } from '@nestjs/swagger';

export class EventStatsDto {
	@ApiProperty()
	totalBookings: number;

	@ApiProperty()
	totalCheckIns: number;

	@ApiProperty()
	checkInRate: number;

	@ApiProperty({ description: 'Bookings over the last 7 days' })
	bookingsByDay: { date: string; count: number }[];
}

export class OrganizerStatsDto {
	@ApiProperty()
	totalEvents: number;

	@ApiProperty()
	totalBookings: number;

	@ApiProperty()
	totalCheckIns: number;

	@ApiProperty({ type: [Object] })
	topEvents: { title: string; bookings: number }[];
}
