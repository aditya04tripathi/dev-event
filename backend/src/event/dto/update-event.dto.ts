import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateEventDto {
	@ApiProperty({ example: 'Tech Conference 2024', required: false })
	@IsString()
	@IsOptional()
	title?: string;

	@ApiProperty({ example: 'tech-conference-2024', required: false })
	@IsString()
	@IsOptional()
	slug?: string;

	@ApiProperty({
		example: 'A comprehensive guide to modern tech.',
		required: false,
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({
		example: 'Join us for an amazing experience.',
		required: false,
	})
	@IsString()
	@IsOptional()
	overview?: string;

	@ApiProperty({ example: 'Convention Center', required: false })
	@IsString()
	@IsOptional()
	venue?: string;

	@ApiProperty({ example: 'San Francisco, CA', required: false })
	@IsString()
	@IsOptional()
	location?: string;

	@ApiProperty({ example: '2024-12-25T10:00:00.000Z', required: false })
	@IsString()
	@IsOptional()
	date?: string;

	@ApiProperty({ example: '10:00 AM', required: false })
	@IsString()
	@IsOptional()
	time?: string;

	@ApiProperty({ enum: ['online', 'offline', 'hybrid'], required: false })
	@IsEnum(['online', 'offline', 'hybrid'])
	@IsOptional()
	mode?: string;

	@ApiProperty({ example: 'Developers', required: false })
	@IsString()
	@IsOptional()
	audience?: string;

	@ApiProperty({ example: 'Tech Corp', required: false })
	@IsString()
	@IsOptional()
	organizer?: string;

	@ApiProperty({
		type: 'string',
		description: 'JSON string of tags',
		required: false,
	})
	@IsString()
	@IsOptional()
	tags?: string;

	@ApiProperty({
		type: 'string',
		description: 'JSON string of agenda items',
		required: false,
	})
	@IsString()
	@IsOptional()
	agenda?: string;

	@ApiProperty({ type: 'string', format: 'binary', required: false })
	@IsOptional()
	image?: any;
}
