import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userProviders } from './user.providers';
import { DatabaseModule } from '../database/database.module';
import { EventModule } from '../event/event.module';

import { OrganizerController } from './organizer.controller';

@Module({
	imports: [DatabaseModule, EventModule],
	controllers: [UserController, OrganizerController],
	providers: [UserService, ...userProviders],
	exports: [UserService],
})
export class UserModule {}
