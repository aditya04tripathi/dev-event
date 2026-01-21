import { ApiProperty } from '@nestjs/swagger';

export class EventResponseDto {
	@ApiProperty({ example: '60d0fe4f5311236168a109ca' })
	_id: string;

	@ApiProperty({ example: 'Tech Conference 2024' })
	title: string;

	@ApiProperty({ example: 'tech-conference-2024' })
	slug: string;

	@ApiProperty({ example: 'A conference about latest tech' })
	description: string;

	@ApiProperty({ example: 'https://cdn.example.com/image.png' })
	image: string;

	@ApiProperty({ example: 'Mumbai' })
	venue: string;

	@ApiProperty({ example: 'NESCO, Goregaon' })
	location: string;

	@ApiProperty({ example: '2024-12-01' })
	date: string;

	@ApiProperty({ example: '10:00 AM' })
	time: string;

	@ApiProperty({ example: 'physical', enum: ['physical', 'virtual'] })
	mode: string;

	@ApiProperty({
		example: 'Developers',
		enum: ['Everyone', 'Developers', 'Students', 'Professionals'],
	})
	audience: string;

	@ApiProperty({ example: [{ time: '10:00 AM', activity: 'Keynote' }] })
	agenda: any[];

	@ApiProperty({ example: '60d0fe4f5311236168a109cb' })
	organizerId: string;

	@ApiProperty({ example: ['tech', 'coding'] })
	tags: string[];

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}

export class PaginatedEventResponseDto {
	@ApiProperty({ type: [EventResponseDto], description: 'List of events' })
	events: EventResponseDto[];

	@ApiProperty({ example: 10, description: 'Total number of events' })
	totalEvents: number;

	@ApiProperty({ example: 2, description: 'Total number of pages' })
	totalPages: number;

	@ApiProperty({ example: 1, description: 'Current page number' })
	currentPage: number;

	@ApiProperty({
		example: 2,
		description: 'Next page number',
		required: false,
		nullable: true,
	})
	nextPage: number | null;

	@ApiProperty({
		example: null,
		description: 'Previous page number',
		required: false,
		nullable: true,
	})
	prevPage: number | null;
}
