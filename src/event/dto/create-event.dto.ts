import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
	@ApiProperty({ example: 'Tech Conference 2024' })
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({ example: 'tech-conference-2024' })
	@IsString()
	@IsNotEmpty()
	slug: string;

	@ApiProperty({ example: 'A comprehensive guide to modern tech.' })
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty({ example: 'Join us for an amazing experience.' })
	@IsString()
	@IsNotEmpty()
	overview: string;

	@ApiProperty({ example: 'Convention Center' })
	@IsString()
	@IsNotEmpty()
	venue: string;

	@ApiProperty({ example: 'San Francisco, CA' })
	@IsString()
	@IsNotEmpty()
	location: string;

	@ApiProperty({ example: '2024-12-25T10:00:00.000Z' })
	@IsString()
	@IsNotEmpty()
	date: string;

	@ApiProperty({ example: '10:00 AM' })
	@IsString()
	@IsNotEmpty()
	time: string;

	@ApiProperty({ enum: ['online', 'offline', 'hybrid'] })
	@IsEnum(['online', 'offline', 'hybrid'])
	mode: string;

	@ApiProperty({ example: 'Developers' })
	@IsString()
	@IsNotEmpty()
	audience: string;

	@ApiProperty({ example: 'Tech Corp' })
	@IsString()
	@IsNotEmpty()
	organizer: string;

	@ApiProperty({ type: 'string', description: 'JSON string of tags' })
	@IsString()
	@IsNotEmpty()
	tags: string;

	@ApiProperty({ type: 'string', description: 'JSON string of agenda items' })
	@IsString()
	@IsNotEmpty()
	agenda: string;

	@ApiProperty({ type: 'string', format: 'binary' })
	@IsOptional()
	image: any;
}
