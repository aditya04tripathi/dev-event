import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { EnvService } from 'src/env/env.service';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from 'src/user/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		envService: EnvService,
		@Inject(User.name) private userModel: Model<User>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: envService.JwtSecret,
		});
	}

	async validate(payload: {
		sub: string;
		email: string;
		iat: number;
	}): Promise<UserDocument> {
		const user: UserDocument | null = await this.userModel
			.findById(payload.sub)
			.select('-password');

		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		return user;
	}
}
