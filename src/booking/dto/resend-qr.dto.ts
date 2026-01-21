import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendQRCodeDto {
	@ApiProperty({ example: 'john@example.com' })
	@IsEmail()
	@IsNotEmpty()
	email: string;
}
