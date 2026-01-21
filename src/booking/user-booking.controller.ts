import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { JwtGuard } from 'src/utils/guards';
import { ApiWrappedResponse } from 'src/utils/decorators';
import type { Request, Response } from 'express';
import { BookingResponseDto } from './dto/booking-response.dto';

@ApiTags('User Bookings')
@Controller('bookings')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class UserBookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Get('my-bookings')
	@ApiOperation({ summary: 'Get current user bookings' })
	@ApiWrappedResponse(BookingResponseDto, 200, 'List of user bookings')
	async getUserBookings(@Req() req: Request) {
		const email = (req.user as any).email;
		return await this.bookingService.getUserBookings(email);
	}

	@Get('ticket/:id')
	@ApiOperation({ summary: 'Get booking ticket details' })
	@ApiWrappedResponse(BookingResponseDto, 200, 'Booking ticket details')
	async getBookingTicket(@Param('id') id: string, @Req() req: Request) {
		const email = (req.user as any).email;
		return await this.bookingService.getBookingTicket(id, email);
	}

	@Get('ticket/:id/ics')
	@ApiOperation({ summary: 'Download ICS calendar file' })
	async downloadIcs(
		@Param('id') id: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const email = (req.user as any).email;
		const icsContent = await this.bookingService.generateIcsFile(id, email);

		res.setHeader('Content-Type', 'text/calendar');
		res.setHeader(
			'Content-Disposition',
			'attachment; filename="event-booking.ics"',
		);
		res.send(icsContent);
	}
}
