import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('sign-up')
	@ApiOperation({ summary: 'Register a new user' })
	@ApiBody({
		type: RegisterUserDto,
	})
	signUp(@Body() userData: RegisterUserDto) {
		return this.authService.signUp(userData);
	}

	@Post('sign-in')
	@ApiOperation({ summary: 'Login user' })
	@ApiBody({
		type: LoginUserDto,
	})
	signIn(@Body() loginData: LoginUserDto) {
		return this.authService.signIn(loginData);
	}
}
