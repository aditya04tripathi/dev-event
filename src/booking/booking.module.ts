import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { EventModule } from '../event/event.module';
import { bookingProviders } from './booking.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
	imports: [DatabaseModule, EventModule],
	controllers: [BookingController],
	providers: [BookingService, ...bookingProviders],
	exports: [BookingService],
})
export class BookingModule {}
