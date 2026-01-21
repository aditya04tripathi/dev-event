import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetEventsDto {
	@ApiPropertyOptional({
		description: 'Page number for pagination',
		minimum: 1,
		default: 1,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number = 1;

	@ApiPropertyOptional({
		description: 'Number of items per page',
		minimum: 1,
		default: 9,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit?: number = 9;

	@ApiPropertyOptional({
		description: 'Sort order',
		enum: ['asc', 'desc'],
		default: 'asc',
	})
	@IsOptional()
	@IsEnum(['asc', 'desc'])
	sort?: 'asc' | 'desc' = 'asc';

	@ApiPropertyOptional({
		description: 'Search term for title, description, location, or organizer',
	})
	@IsOptional()
	@IsString()
	search?: string;

	@ApiPropertyOptional({
		description: 'Filter by tags (comma separated)',
		type: String, // Can be string or array in query, but usually passed as string in query param
	})
	@IsOptional()
	tags?: string[] | string;

	@ApiPropertyOptional({
		description: 'Filter by event mode',
		enum: ['online', 'offline', 'hybrid'],
	})
	@IsOptional()
	@IsEnum(['online', 'offline', 'hybrid'])
	mode?: 'online' | 'offline' | 'hybrid';
}
