import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../../common';

export class EventResponseDto {
	@ApiProperty({ example: '60d0fe4f5311236168a109ca' })
	_id: string;

	@ApiProperty({ example: 'Tech Conference 2024' })
	title: string;

	@ApiProperty({ example: 'tech-conference-2024' })
	slug: string;

	@ApiProperty({ example: 'A conference about latest tech' })
	description: string;

	@ApiProperty({ example: 'Join us for an amazing tech experience' })
	overview: string;

	@ApiProperty({ example: 'https://cdn.example.com/image.png' })
	image: string;

	@ApiProperty({ example: 'Convention Center' })
	venue: string;

	@ApiProperty({ example: 'NESCO, Goregaon' })
	location: string;

	@ApiProperty({ example: '2024-12-01T10:00:00.000Z' })
	date: string;

	@ApiProperty({ example: '10:00 AM' })
	time: string;

	@ApiProperty({ example: 'hybrid', enum: ['online', 'offline', 'hybrid'] })
	mode: string;

	@ApiProperty({
		example: 'Developers',
		description: 'Target audience',
	})
	audience: string;

	@ApiProperty({
		example: ['Opening Keynote', 'Tech Workshop', 'Networking Session'],
		description: 'Event agenda items',
		type: [String],
	})
	agenda: string[];

	@ApiProperty({
		type: 'object',
		description: 'Event organizer details',
		properties: {
			_id: { type: 'string' },
			fullName: { type: 'string' },
			username: { type: 'string' },
			email: { type: 'string' },
			avatar: { type: 'string' },
			roles: { type: 'array', items: { type: 'string' } },
		},
		additionalProperties: false,
	})
	organizer: {
		_id: string;
		fullName: string;
		username: string;
		email: string;
		avatar: string;
		roles: string[];
	};

	@ApiProperty({ example: ['tech', 'coding'], type: [String] })
	tags: string[];

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}

export class PaginatedEventResponseDto extends PaginatedResponseDto<EventResponseDto> {}
