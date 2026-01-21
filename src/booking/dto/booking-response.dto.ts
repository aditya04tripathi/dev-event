import { ApiProperty } from '@nestjs/swagger';

export class BookingResponseDto {
	@ApiProperty({ example: '60d0fe4f5311236168a109ca' })
	_id: string;

	@ApiProperty({ example: '60d0fe4f5311236168a109cb' })
	eventId: string;

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

export class PaginatedParticipantResponseDto {
	@ApiProperty({ type: [ParticipantResponseDto] })
	participants: ParticipantResponseDto[];

	@ApiProperty()
	totalParticipants: number;

	@ApiProperty()
	currentPage: number;

	@ApiProperty()
	totalPages: number;
}
