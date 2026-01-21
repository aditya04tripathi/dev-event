import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { DatabaseModule } from 'src/database/database.module';
import { eventProviders } from './event.providers';

@Module({
	imports: [DatabaseModule],
	providers: [EventService, ...eventProviders],
	controllers: [EventController],
	exports: [EventService, ...eventProviders],
})
export class EventModule {}
