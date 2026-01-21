import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/utils/decorators';
import { JwtGuard, RolesGuard } from 'src/utils/guards';
import { Role } from './enums/role.enum';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(JwtGuard, RolesGuard)
	@Get('me')
	@ApiOperation({ summary: 'Get current user profile' })
	getCurrentUser(@Req() req: Request) {
		return req.user;
	}

	@UseGuards(JwtGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@Get('all')
	@ApiOperation({ summary: 'Get all users (Admin only)' })
	getAllUsers() {
		return this.userService.findAll();
	}
}
