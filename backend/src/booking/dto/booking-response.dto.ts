import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../../common';

export class BookingResponseDto {
	@ApiProperty({ example: '60d0fe4f5311236168a109ca' })
	_id: string;

	@ApiProperty({
		type: 'object',
		description: 'Complete event object with organizer details',
		additionalProperties: true,
		properties: {
			_id: { type: 'string' },
			title: { type: 'string' },
			slug: { type: 'string' },
			description: { type: 'string' },
			overview: { type: 'string' },
			image: { type: 'string' },
			venue: { type: 'string' },
			location: { type: 'string' },
			date: { type: 'string' },
			time: { type: 'string' },
			mode: { type: 'string' },
			audience: { type: 'string' },
			organizer: {
				type: 'object',
				properties: {
					fullName: { type: 'string' },
					username: { type: 'string' },
					email: { type: 'string' },
					avatar: { type: 'string' },
					roles: { type: 'array', items: { type: 'string' } },
				},
			},
			tags: { type: 'array', items: { type: 'string' } },
			agenda: { type: 'array', items: { type: 'string' } },
		},
	})
	event: {
		_id: string;
		title: string;
		slug: string;
		description: string;
		overview: string;
		image: string;
		venue: string;
		location: string;
		date: string;
		time: string;
		mode: string;
		audience: string;
		organizer: {
			fullName: string;
			username: string;
			email: string;
			avatar: string;
			roles: string[];
		};
		tags: string[];
		agenda: string[];
	};

	@ApiProperty({ example: 'John Doe' })
	name: string;

	@ApiProperty({ example: 'john@example.com' })
	email: string;

	@ApiProperty({
		example: 'data:image/png;base64,...',
		description: 'Base64 encoded QR code image',
	})
	qrCode: string;

	@ApiProperty({ required: false })
	checkedInAt?: Date;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}

export class CheckInResponseDto {
	@ApiProperty({ example: '60d0fe4f5311236168a109ca' })
	id: string;

	@ApiProperty({ example: 'John Doe' })
	name: string;

	@ApiProperty({ example: 'john@example.com' })
	email: string;

	@ApiProperty({ example: 'Tech Conference 2024' })
	eventTitle: string;

	@ApiProperty()
	checkedInAt: string;
}

export class ScanTicketResponseDto {
	@ApiProperty({ example: '60d0fe4f5311236168a109ca' })
	id: string;

	@ApiProperty({ example: 'John Doe' })
	name: string;

	@ApiProperty({ example: 'john@example.com' })
	email: string;

	@ApiProperty({ example: 'Tech Conference 2024' })
	eventTitle: string;

	@ApiProperty({ example: true })
	isAlreadyCheckedIn: boolean;

	@ApiProperty({ required: false })
	checkedInAt?: string;

	@ApiProperty()
	bookedAt: string;
}

export class ParticipantResponseDto {
	@ApiProperty({ example: '60d0fe4f5311236168a109ca' })
	_id: string;

	@ApiProperty({ example: 'John Doe' })
	name: string;

	@ApiProperty({ example: 'john@example.com' })
	email: string;

	@ApiProperty({ required: false })
	checkedInAt?: Date;

	@ApiProperty()
	createdAt: Date;
}

export class PaginatedParticipantResponseDto extends PaginatedResponseDto<ParticipantResponseDto> {}
