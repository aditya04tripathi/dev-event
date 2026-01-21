import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckInDto {
	@ApiProperty({ description: 'Encrypted QR code data' })
	@IsString()
	@IsNotEmpty()
	qrData: string;
}
