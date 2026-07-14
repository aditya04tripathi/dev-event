import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UserDocument } from 'src/user/user.schema';

export interface JwtPayload {
	sub: string;
	email: string;
	iat?: number;
	exp?: number;
}

@Injectable()
export class CustomJwtService {
	constructor(private readonly jwtService: JwtService) {}

	generateToken(user: UserDocument): string {
		const payload: JwtPayload = {
			sub: user._id.toString(),
			email: user.email,
		};

		return this.jwtService.sign(payload);
	}

	async verifyToken(token: string): Promise<JwtPayload> {
		return this.jwtService.verify(token);
	}

	async decodeToken(token: string): Promise<JwtPayload | null> {
		try {
			return this.jwtService.decode(token);
		} catch {
			return null;
		}
	}
}
