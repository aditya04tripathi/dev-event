import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { UserModule } from 'src/user/user.module';
import { EventModule } from 'src/event/event.module';
import { BookingModule } from 'src/booking/booking.module';
import { MinioModule } from 'src/minio/minio.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [UserModule, EventModule, BookingModule, MinioModule, AuthModule],
	controllers: [SeedController],
	providers: [SeedService],
})
export class SeedModule {}
