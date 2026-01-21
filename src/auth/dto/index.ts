import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';
import { Role } from 'src/user/enums/role.enum';

export class RegisterUserDto {
	@ApiProperty({ example: 'johndoe' })
	@IsString()
	@IsNotEmpty()
	username: string;

	@ApiProperty({ example: 'John Doe' })
	@IsString()
	@IsNotEmpty()
	fullName: string;

	@ApiProperty({ example: 'john@doe.com' })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ example: 'supersecretpa$$word' })
	@IsNotEmpty()
	@IsString()
	password: string;

	@ApiProperty({
		example: Role.USER,
		enum: Role,
		required: false,
		description:
			'User role (USER or ORGANIZER). Defaults to USER if not provided.',
	})
	@IsOptional()
	@IsEnum(Role, {
		message: 'Role must be either user or organizer',
	})
	role?: Role;
}

export class LoginUserDto {
	@ApiProperty({ example: 'john@doe.com' })
	@IsNotEmpty()
	@IsString()
	usernameOrEmail: string;

	@ApiProperty({ example: 'supersecretpa$$word' })
	@IsNotEmpty()
	@IsString()
	password: string;
}
