import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtGuard, OrganizerGuard, RolesGuard } from 'src/utils/guards';
import { Roles } from 'src/utils/decorators';
import { Role } from 'src/user/enums/role.enum';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginatedEventResponseDto } from './dto/event-response.dto';
import { GetEventsDto } from './dto/get-events.dto';
import { EventService } from './event.service';
import { Event } from './event.schema';

@ApiTags('Events')
@Controller('event')
export class EventController {
	constructor(private readonly eventService: EventService) {}

	@Get()
	@ApiOperation({ summary: 'Get all events with pagination and filtering' })
	@ApiResponse({
		status: 200,
		description: 'The list of events',
		type: PaginatedEventResponseDto,
	})
	async findAll(@Query() query: GetEventsDto) {
		return await this.eventService.getAllEvents(query);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get event by ID or Slug' })
	@ApiResponse({
		status: 200,
		description: 'The event details',
		type: Event,
	})
	@ApiResponse({ status: 404, description: 'Event not found' })
	async findOne(@Param('id') id: string) {
		const event = await this.eventService.getEventById(id);
		if (!event) {
			throw new NotFoundException('Event not found');
		}
		return event;
	}

	@Post()
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(Role.ORGANIZER)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create a new event (ORGANIZER only)' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'Event creation data with image',
		type: CreateEventDto,
	})
	@ApiResponse({
		status: 201,
		description: 'The event has been successfully created.',
		type: Event,
	})
	@ApiResponse({ status: 409, description: 'Event with slug already exists' })
	@ApiResponse({
		status: 403,
		description: 'Forbidden - ORGANIZER role required',
	})
	@UseInterceptors(FileInterceptor('image'))
	async create(
		@Req() req: Request,
		@Body() createEventDto: CreateEventDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		const userId = (req.user as any)._id || (req.user as any).id;
		try {
			return await this.eventService.createEvent(createEventDto, file, userId);
		} catch (error) {
			if (error.message === 'An event with this slug already exists') {
				throw new ConflictException(error.message);
			}
			throw error;
		}
	}

	@Patch(':id')
	@UseGuards(JwtGuard, RolesGuard, OrganizerGuard)
	@Roles(Role.ORGANIZER)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update an event (ORGANIZER only, own events)' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'Event update data with optional image',
		type: UpdateEventDto,
	})
	@ApiResponse({
		status: 200,
		description: 'The event has been successfully updated.',
		type: Event,
	})
	@ApiResponse({ status: 404, description: 'Event not found' })
	@ApiResponse({
		status: 403,
		description: 'Forbidden - Not the event organizer',
	})
	@UseInterceptors(FileInterceptor('image'))
	async update(
		@Req() req: Request,
		@Param('id') id: string,
		@Body() updateEventDto: UpdateEventDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		const userId = (req.user as any)._id || (req.user as any).id;
		return await this.eventService.updateEvent(
			id,
			userId,
			updateEventDto,
			file,
		);
	}

	@Delete(':id')
	@UseGuards(JwtGuard, RolesGuard, OrganizerGuard)
	@Roles(Role.ORGANIZER)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete an event (ORGANIZER only, own events)' })
	@ApiResponse({
		status: 200,
		description: 'The event has been successfully deleted.',
	})
	@ApiResponse({ status: 404, description: 'Event not found' })
	@ApiResponse({
		status: 403,
		description: 'Forbidden - Not the event organizer',
	})
	async remove(@Req() req: Request, @Param('id') id: string) {
		const userId = (req.user as any)._id || (req.user as any).id;
		return await this.eventService.deleteEvent(id, userId);
	}

	@Get('organizer/my-events')
	@UseGuards(JwtGuard, RolesGuard)
	@Roles(Role.ORGANIZER)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get all events created by the organizer' })
	@ApiResponse({
		status: 200,
		description: 'The list of organizer events',
		type: PaginatedEventResponseDto,
	})
	async getMyEvents(@Req() req: Request, @Query() query: GetEventsDto) {
		const userId = (req.user as any)._id || (req.user as any).id;
		return await this.eventService.getEventsByUser(userId, query);
	}
}
