import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Roles, ApiWrappedResponse } from 'src/utils/decorators';
import { JwtGuard, RolesGuard } from 'src/utils/guards';
import { Role } from './enums/role.enum';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { EventService } from '../event/event.service';
import { GetEventsDto } from '../event/dto/get-events.dto';
import { PaginatedEventResponseDto } from '../event/dto/event-response.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly eventService: EventService,
	) {}

	@UseGuards(JwtGuard, RolesGuard)
	@Get('me')
	@ApiOperation({ summary: 'Get current user profile' })
	@ApiWrappedResponse(UserResponseDto, 200, 'The current user profile')
	getCurrentUser(@Req() req: Request) {
		return req.user;
	}

	@UseGuards(JwtGuard, RolesGuard)
	@Get('profile')
	@ApiOperation({ summary: 'Get current user profile (Alias)' })
	@ApiWrappedResponse(UserResponseDto, 200, 'The current user profile')
	getProfile(@Req() req: Request) {
		return req.user;
	}

	@UseGuards(JwtGuard)
	@Get('events')
	@ApiOperation({ summary: 'Get events created by current user' })
	@ApiWrappedResponse(PaginatedEventResponseDto, 200, 'The list of user events')
	async getMyEvents(@Req() req: Request, @Query() query: GetEventsDto) {
		const userId = (req.user as any)._id || (req.user as any).id;
		return this.eventService.getEventsByUser(userId, query);
	}

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
