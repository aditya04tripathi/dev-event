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
	Res,
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
import {
	BookingResponseDto,
	CheckInResponseDto,
	ScanTicketResponseDto,
	PaginatedParticipantResponseDto,
} from './dto/booking-response.dto';
import { JwtGuard, RoleGuard } from 'src/utils/guards';
import { Roles, ApiWrappedResponse } from 'src/utils/decorators';
import { Role } from 'src/user/enums/role.enum';
import type { Request, Response } from 'express';

@ApiTags('Booking')
@Controller('event/:id')
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Post('book')
	@ApiOperation({ summary: 'Book an event ticket' })
	@ApiWrappedResponse(BookingResponseDto, 201, 'Booking confirmed')
	async bookEvent(
		@Param('id') id: string,
		@Body() createBookingDto: CreateBookingDto,
	) {
		return await this.bookingService.createBooking(id, createBookingDto);
	}

	@Post('scan-ticket')
	@UseGuards(JwtGuard, RoleGuard)
	@Roles(Role.ORGANIZER)
	@ApiBearerAuth()
	@ApiOperation({
		summary:
			'Scan ticket - verify and optionally check-in attendee (ORGANIZER only)',
	})
	@ApiWrappedResponse(ScanTicketResponseDto, 200, 'Ticket processed')
	async scanTicket(@Param('id') id: string, @Body() checkInDto: CheckInDto) {
		if (checkInDto.checkIn) {
			return await this.bookingService.checkIn(id, checkInDto);
		}
		return await this.bookingService.scanTicket(id, checkInDto);
	}

	@Get('participants')
	@UseGuards(JwtGuard, RoleGuard)
	@Roles(Role.ORGANIZER)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get all participants for an event (ORGANIZER only)',
	})
	@ApiWrappedResponse(
		PaginatedParticipantResponseDto,
		200,
		'List of participants',
	)
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

	@Get('booking/:bookingId')
	@UseGuards(JwtGuard, RoleGuard)
	@Roles(Role.ORGANIZER)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get booking details by ID (ORGANIZER only)',
	})
	@ApiWrappedResponse(ScanTicketResponseDto, 200, 'Booking details')
	async getBookingById(
		@Param('id') id: string,
		@Param('bookingId') bookingId: string,
	) {
		return await this.bookingService.getBookingById(id, bookingId);
	}

	@Delete('participants/:bookingId')
	@UseGuards(JwtGuard, RoleGuard)
	@Roles(Role.ADMIN)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Remove a participant from an event (ADMIN only)',
	})
	@ApiWrappedResponse(undefined, 200, 'Participant removed')
	async removeParticipant(
		@Req() req: Request,
		@Param('id') id: string,
		@Param('bookingId') bookingId: string,
	) {
		const userId = (req.user as any)._id || (req.user as any).id;
		return await this.bookingService.removeParticipant(id, bookingId, userId);
	}

	@Post('participants/resend-qr')
	@UseGuards(JwtGuard, RoleGuard)
	@Roles(Role.ORGANIZER)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Resend QR code ticket to participant (ORGANIZER only)',
	})
	@ApiWrappedResponse(BookingResponseDto, 200, 'QR code resent')
	async resendQRCode(
		@Req() req: Request,
		@Param('id') id: string,
		@Body() resendDto: ResendQRCodeDto,
	) {
		const userId = (req.user as any)._id || (req.user as any).id;
		return await this.bookingService.resendQRCode(id, resendDto.email, userId);
	}

	@Get('export-csv')
	@UseGuards(JwtGuard, RoleGuard)
	@Roles(Role.ORGANIZER)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Export participants as CSV (ORGANIZER only)',
	})
	async exportCsv(
		@Req() req: Request,
		@Param('id') id: string,
		@Res() res: Response,
	) {
		const userId = (req as any).validatedUserId!;
		const csvData = await this.bookingService.exportBookingsCsv(id, userId);

		res.setHeader('Content-Type', 'text/csv');
		res.setHeader(
			'Content-Disposition',
			`attachment; filename="participants-${id}.csv"`,
		);
		res.send(csvData);
	}
}
