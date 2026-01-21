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

@Module({
	imports: [
		EnvModule,
		DatabaseModule,
		MinioModule,
		JwtModule,
		AuthModule,
		UserModule,
		EventModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
