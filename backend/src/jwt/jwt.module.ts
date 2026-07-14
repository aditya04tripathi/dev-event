import { Module, Global } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { EnvModule } from 'src/env/env.module';
import { EnvService } from 'src/env/env.service';
import { CustomJwtService } from './jwt.service';

@Global()
@Module({
	imports: [
		NestJwtModule.registerAsync({
			imports: [EnvModule],
			useFactory: (envService: EnvService) => ({
				secret: envService.JwtSecret,
			}),
			inject: [EnvService],
		}),
	],
	providers: [CustomJwtService],
	exports: [CustomJwtService, NestJwtModule],
})
export class JwtModule {}
