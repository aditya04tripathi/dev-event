import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

export class UserResponseDto {
	@ApiProperty({ example: '60d0fe4f5311236168a109ca' })
	_id: string;

	@ApiProperty({ example: 'johndoe' })
	username: string;

	@ApiProperty({ example: 'john@example.com' })
	email: string;

	@ApiProperty({ example: 'John Doe' })
	fullName: string;

	@ApiProperty({ enum: Role, isArray: true })
	roles: Role[];

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
