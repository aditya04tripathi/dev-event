import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../event.schema';

export class PaginatedEventResponseDto {
	@ApiProperty({ type: [Event], description: 'List of events' })
	events: Event[];

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
