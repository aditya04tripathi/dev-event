import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CheckInDto {
	@ApiProperty({ description: 'Encrypted QR code data' })
	@IsString()
	@IsNotEmpty()
	qrData: string;

	@ApiProperty({
		description: 'Whether to check-in the attendee or just verify the ticket',
		default: false,
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	checkIn?: boolean = false;
}
