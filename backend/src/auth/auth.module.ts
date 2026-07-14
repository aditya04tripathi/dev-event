import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/utils/strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '../jwt/jwt.module';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from 'src/user/user.providers';

@Module({
	imports: [DatabaseModule, PassportModule, JwtModule],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, ...userProviders],
	exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
