import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Roles, ApiWrappedResponse } from 'src/utils/decorators';
import { JwtGuard, RoleGuard } from 'src/utils/guards';
import { Role } from './enums/role.enum';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(JwtGuard, RoleGuard)
	@Get('me')
	@ApiOperation({ summary: 'Get current user profile' })
	@ApiWrappedResponse(UserResponseDto, 200, 'The current user profile')
	getCurrentUser(@Req() req: Request) {
		return req.user;
	}

	@UseGuards(JwtGuard, RoleGuard)
	@Roles(Role.ADMIN)
	@Get('all')
	@ApiOperation({ summary: 'Get all users (Admin only)' })
	@ApiWrappedResponse(UserResponseDto, 200, 'List of all users', true)
	getAllUsers() {
		return this.userService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user info by ID' })
	@ApiWrappedResponse(UserResponseDto, 200, 'User profile')
	async getUser(@Param('id') id: string) {
		return this.userService.findById(id);
	}
}
