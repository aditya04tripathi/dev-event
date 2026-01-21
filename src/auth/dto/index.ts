import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
