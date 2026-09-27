import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { UserModule } from 'src/user/user.module';
import { EventModule } from 'src/event/event.module';
import { BookingModule } from 'src/booking/booking.module';
import { StorageModule } from 'src/storage/storage.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [UserModule, EventModule, BookingModule, StorageModule, AuthModule],
	controllers: [SeedController],
	providers: [SeedService],
})
export class SeedModule {}
