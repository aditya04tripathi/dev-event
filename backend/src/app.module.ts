import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { UserModule } from './user/user.module';
import { EnvModule } from './env/env.module';
import { DatabaseModule } from './database/database.module';
import { MinioModule } from './minio/minio.module';
import { EventModule } from './event/event.module';
import { BookingModule } from './booking/booking.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SeedModule } from './seed/seed.module';
import { HealthController } from './health/health.controller';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
	imports: [
		EnvModule,
		DatabaseModule,
		MinioModule,
		JwtModule,
		AuthModule,
		UserModule,
		EventModule,
		BookingModule,
		AnalyticsModule,
		SeedModule,
	],

	controllers: [AppController, HealthController, MetricsController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: MetricsInterceptor,
		},
	],
})
export class AppModule {}
