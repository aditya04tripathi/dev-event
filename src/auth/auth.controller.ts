import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('sign-up')
	@ApiOperation({ summary: 'Register a new user' })
	@ApiBody({
		type: RegisterUserDto,
	})
	@ApiResponse({
		status: 201,
		description: 'The user has been successfully created.',
		type: AuthResponseDto,
	})
	signUp(@Body() userData: RegisterUserDto) {
		return this.authService.signUp(userData);
	}

	@Post('sign-in')
	@ApiOperation({ summary: 'Login user' })
	@ApiBody({
		type: LoginUserDto,
	})
	@ApiResponse({
		status: 200,
		description: 'User successfully logged in.',
		type: AuthResponseDto,
	})
	signIn(@Body() loginData: LoginUserDto) {
		return this.authService.signIn(loginData);
	}
}
