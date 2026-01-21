import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';

import { User, UserDocument } from 'src/user/user.schema';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { CustomJwtService } from 'src/jwt/jwt.service';

@Injectable()
export class AuthService {
	constructor(
		@Inject(User.name) private userModel: Model<User>,
		private jwtService: CustomJwtService,
	) {}

	async validateUser(
		username: string,
		password: string,
	): Promise<UserDocument> {
		const user = await this.userModel.findOne({
			$or: [{ username }, { email: username }],
		});
		if (user && (await argon2.verify(user.password, password))) {
			return user;
		}

		throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
	}

	async signUp(
		userData: RegisterUserDto,
	): Promise<{ token: string; user: UserDocument }> {
		try {
			const userExists = await this.userModel.findOne({
				username: userData.username,
				$or: [{ email: userData.email }],
			});
			if (userExists) {
				throw new HttpException(
					'Username or email already in use',
					HttpStatus.CONFLICT,
				);
			}

			const assignedRole = userData.role || 'user';
			if (assignedRole === 'admin') {
				throw new HttpException(
					'Cannot assign admin role through registration',
					HttpStatus.FORBIDDEN,
				);
			}

			const newUser = await this.userModel.create({
				username: userData.username,
				email: userData.email,
				fullName: userData.fullName,
				password: userData.password,
				roles: [assignedRole],
			});
			if (!newUser) {
				throw new HttpException(
					'Failed to create user',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}

			const token = this.jwtService.generateToken(newUser);
			return {
				token,
				user: newUser,
			};
		} catch (error) {
			throw new HttpException(
				(error as Error).message || 'An error occurred during registration',
				(error as HttpException).getStatus() ||
					HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async signIn(loginData: LoginUserDto) {
		try {
			const user = await this.userModel.findOne({
				$or: [
					{ username: loginData.usernameOrEmail },
					{ email: loginData.usernameOrEmail },
				],
			});
			if (!user) {
				throw new HttpException(
					'Invalid username/email or password',
					HttpStatus.UNAUTHORIZED,
				);
			}

			const passwordValid = await argon2.verify(
				user.password,
				loginData.password,
			);
			if (!passwordValid) {
				throw new HttpException(
					'Invalid username/email or password',
					HttpStatus.UNAUTHORIZED,
				);
			}

			const token = this.jwtService.generateToken(user);
			return {
				token,
				user,
			};
		} catch (error) {
			throw new HttpException(
				(error as Error).message || 'An error occurred during login',
				(error as HttpException).getStatus() || 500,
			);
		}
	}
}
