import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { EventStatsDto, OrganizerStatsDto } from './dto/analytics.dto';
import { JwtGuard, RolesGuard } from 'src/utils/guards';
import { Roles, ApiWrappedResponse } from 'src/utils/decorators';
import { Role } from 'src/user/enums/role.enum';
import type { Request } from 'express';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ORGANIZER)
@ApiBearerAuth()
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) {}

	@Get('organizer')
	@ApiOperation({ summary: 'Get overall organizer stats (ORGANIZER only)' })
	@ApiWrappedResponse(OrganizerStatsDto, 200, 'Overall organizer statistics')
	async getOrganizerStats(@Req() req: Request) {
		const userId = (req.user as any)._id || (req.user as any).id;
		return await this.analyticsService.getOrganizerStats(userId);
	}

	@Get('event/:id')
	@ApiOperation({ summary: 'Get stats for a specific event (ORGANIZER only)' })
	@ApiWrappedResponse(EventStatsDto, 200, 'Event-specific statistics')
	async getEventStats(@Req() req: Request, @Param('id') id: string) {
		const userId = (req.user as any)._id || (req.user as any).id;
		return await this.analyticsService.getEventStats(id, userId);
	}
}
