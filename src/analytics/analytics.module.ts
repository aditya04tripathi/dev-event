import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { DatabaseModule } from '../database/database.module';
import { eventProviders } from '../event/event.providers';
import { bookingProviders } from '../booking/booking.providers';

@Module({
	imports: [DatabaseModule],
	controllers: [AnalyticsController],
	providers: [AnalyticsService, ...eventProviders, ...bookingProviders],
})
export class AnalyticsModule {}
