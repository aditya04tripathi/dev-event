import {
	Body,
	Controller,
	Param,
	Post,
	Get,
	Delete,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CheckInDto } from './dto/check-in.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ResendQRCodeDto } from './dto/resend-qr.dto';
import { JwtGuard, RolesGuard, OrganizerGuard } from 'src/utils/guards';
import { Roles } from 'src/utils/decorators';
import { Role } from 'src/user/enums/role.enum';
import type { Request } from 'express';

@ApiTags('Booking')
@Controller('event/:id')
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Post('book')
	@ApiOperation({ summary: 'Book an event ticket' })
	@ApiResponse({ status: 201, description: 'Booking confirmed' })
	async bookEvent(
		@Param('id') id: string,
		@Body() createBookingDto: CreateBookingDto,
	) {
		return await this.bookingService.createBooking(id, createBookingDto);
	}

	@Post('checkin')
	@UseGuards(JwtGuard, RolesGuard, OrganizerGuard)
	@Roles(Role.ORGANIZER)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Check-in attendee (ORGANIZER only)' })
	@ApiResponse({ status: 200, description: 'Check-in successful' })
	async checkIn(@Param('id') id: string, @Body() checkInDto: CheckInDto) {
		return await this.bookingService.checkIn(id, checkInDto);
	}

	@Get('participants')
	@UseGuards(JwtGuard, RolesGuard, OrganizerGuard)
	@Roles(Role.ORGANIZER)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get all participants for an event (ORGANIZER only)',
	})
	async getParticipants(
		@Req() req: Request,
		@Param('id') id: string,
		@Query('page') page?: number,
		@Query('limit') limit?: number,
		@Query('search') search?: string,
	) {
		const userId = (req.user as any)._id || (req.user as any).id;
		return await this.bookingService.getEventParticipants(id, userId, {
			page,
			limit,
			search,
		});
	}

	@Delete('participants/:bookingId')
	@UseGuards(JwtGuard, RolesGuard, OrganizerGuard)
	@Roles(Role.ORGANIZER)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Remove a participant from an event (ORGANIZER only)',
	})
	async removeParticipant(
		@Req() req: Request,
		@Param('id') id: string,
		@Param('bookingId') bookingId: string,
	) {
		const userId = (req.user as any)._id || (req.user as any).id;
		return await this.bookingService.removeParticipant(id, bookingId, userId);
	}

	@Post('participants/resend-qr')
	@UseGuards(JwtGuard, RolesGuard, OrganizerGuard)
	@Roles(Role.ORGANIZER)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Resend QR code ticket to participant (ORGANIZER only)',
	})
	async resendQRCode(
		@Req() req: Request,
		@Param('id') id: string,
		@Body() resendDto: ResendQRCodeDto,
	) {
		const userId = (req.user as any)._id || (req.user as any).id;
		return await this.bookingService.resendQRCode(id, resendDto.email, userId);
	}
}
