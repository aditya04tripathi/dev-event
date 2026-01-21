import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { ApiWrappedResponse } from 'src/utils/decorators';
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
	@ApiWrappedResponse(
		AuthResponseDto,
		201,
		'The user has been successfully created.',
	)
	signUp(@Body() userData: RegisterUserDto) {
		return this.authService.signUp(userData);
	}

	@Post('sign-in')
	@ApiOperation({ summary: 'Login user' })
	@ApiBody({
		type: LoginUserDto,
	})
	@ApiWrappedResponse(AuthResponseDto, 200, 'User successfully logged in.')
	signIn(@Body() loginData: LoginUserDto) {
		return this.authService.signIn(loginData);
	}
}
