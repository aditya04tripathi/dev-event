import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class AuthResponseDto {
	@ApiProperty({
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
		description: 'JWT access token',
	})
	token: string;

	@ApiProperty({ type: UserResponseDto })
	user: UserResponseDto;
}
