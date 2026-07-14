import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
	@ApiProperty({
		description: 'Array of data items',
		isArray: true,
	})
	data: T[];

	@ApiProperty({
		example: 50,
		description: 'Total number of items',
	})
	total: number;

	@ApiProperty({
		example: 5,
		description: 'Total number of pages',
	})
	totalPages: number;

	@ApiProperty({
		example: 1,
		description: 'Current page number',
	})
	currentPage: number;

	@ApiPropertyOptional({
		example: 2,
		description: 'Next page number',
		nullable: true,
	})
	nextPage?: number | null;

	@ApiPropertyOptional({
		example: null,
		description: 'Previous page number',
		nullable: true,
	})
	prevPage?: number | null;

	@ApiProperty({
		example: 10,
		description: 'Number of items per page',
	})
	limit: number;

	@ApiProperty({
		example: 0,
		description: 'Number of items skipped',
	})
	skip: number;
}
