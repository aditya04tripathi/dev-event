import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/utils/decorators';
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
	@ApiResponse({
		status: 200,
		description: 'The current user profile',
		type: UserResponseDto,
	})
	getCurrentUser(@Req() req: Request) {
		return req.user;
	}

	@UseGuards(JwtGuard, RolesGuard)
	@Get('profile')
	@ApiOperation({ summary: 'Get current user profile (Alias)' })
	@ApiResponse({
		status: 200,
		description: 'The current user profile',
		type: UserResponseDto,
	})
	getProfile(@Req() req: Request) {
		return req.user;
	}

	@UseGuards(JwtGuard)
	@Get('events')
	@ApiOperation({ summary: 'Get events created by current user' })
	@ApiResponse({
		status: 200,
		description: 'The list of user events',
		type: PaginatedEventResponseDto,
	})
	async getMyEvents(@Req() req: Request, @Query() query: GetEventsDto) {
		const userId = (req.user as any)._id || (req.user as any).id;
		return this.eventService.getEventsByUser(userId, query);
	}

	@UseGuards(JwtGuard, RolesGuard)
	@Roles(Role.ADMIN)
	@Get('all')
	@ApiOperation({ summary: 'Get all users (Admin only)' })
	@ApiResponse({
		status: 200,
		description: 'List of all users',
		type: [UserResponseDto],
	})
	getAllUsers() {
		return this.userService.findAll();
	}
}
