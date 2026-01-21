import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { User, UserDocument } from '../user/user.schema';
import { CustomJwtService } from '../jwt/jwt.service';
import { RegisterUserDto, LoginUserDto } from './dto';
import * as argon2 from 'argon2';

describe('AuthService', () => {
	let service: AuthService;
	let userModel: Model<User>;
	let jwtService: CustomJwtService;

	const mockUser: Partial<UserDocument> = {
		_id: 'user123',
		username: 'testuser',
		email: 'test@example.com',
		fullName: 'Test User',
		password: 'hashedPassword',
	} as any;

	const mockUserModel = {
		findOne: jest.fn(),
		create: jest.fn(),
	};

	const mockJwtService = {
		generateToken: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: User.name,
					useValue: mockUserModel,
				},
				{
					provide: CustomJwtService,
					useValue: mockJwtService,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		userModel = module.get<Model<User>>(User.name);
		jwtService = module.get<CustomJwtService>(CustomJwtService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('validateUser', () => {
		it('should validate user with correct credentials', async () => {
			const password = 'password123';
			const hashedPassword = await argon2.hash(password);

			mockUserModel.findOne.mockResolvedValue({
				...mockUser,
				password: hashedPassword,
			});

			const result = await service.validateUser('testuser', password);

			expect(result).toBeDefined();
			expect(mockUserModel.findOne).toHaveBeenCalledWith({
				$or: [{ username: 'testuser' }, { email: 'testuser' }],
			});
		});

		it('should throw HttpException with invalid credentials', async () => {
			mockUserModel.findOne.mockResolvedValue(null);

			await expect(
				service.validateUser('testuser', 'wrongpassword'),
			).rejects.toThrow(
				new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
			);
		});

		it('should throw HttpException with wrong password', async () => {
			mockUserModel.findOne.mockResolvedValue({
				...mockUser,
				password: await argon2.hash('correctpassword'),
			});

			await expect(
				service.validateUser('testuser', 'wrongpassword'),
			).rejects.toThrow(
				new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
			);
		});
	});

	describe('signUp', () => {
		const registerDto: RegisterUserDto = {
			username: 'newuser',
			email: 'newuser@example.com',
			fullName: 'New User',
			password: 'password123',
		};

		it('should create a new user successfully', async () => {
			mockUserModel.findOne.mockResolvedValue(null);
			mockUserModel.create.mockResolvedValue(mockUser);

			const result = await service.signUp(registerDto);

			expect(result).toBeDefined();
			expect(mockUserModel.findOne).toHaveBeenCalledWith({
				username: registerDto.username,
				$or: [{ email: registerDto.email }],
			});
			expect(mockUserModel.create).toHaveBeenCalledWith(registerDto);
		});

		it('should throw HttpException if username already exists', async () => {
			mockUserModel.findOne.mockResolvedValue(mockUser);

			await expect(service.signUp(registerDto)).rejects.toThrow(
				new HttpException(
					'Username or email already in use',
					HttpStatus.CONFLICT,
				),
			);
		});

		it('should throw HttpException if user creation fails', async () => {
			mockUserModel.findOne.mockResolvedValue(null);
			mockUserModel.create.mockResolvedValue(null);

			await expect(service.signUp(registerDto)).rejects.toThrow(
				new HttpException(
					'Failed to create user',
					HttpStatus.INTERNAL_SERVER_ERROR,
				),
			);
		});
	});

	describe('signIn', () => {
		const loginDto: LoginUserDto = {
			usernameOrEmail: 'testuser',
			password: 'password123',
		};

		it('should sign in user with valid credentials', async () => {
			const hashedPassword = await argon2.hash(loginDto.password);
			mockUserModel.findOne.mockResolvedValue({
				...mockUser,
				password: hashedPassword,
			});
			mockJwtService.generateToken.mockReturnValue('jwt-token');

			const result = await service.signIn(loginDto);

			expect(result).toEqual({ token: 'jwt-token' });
			expect(mockUserModel.findOne).toHaveBeenCalledWith({
				$or: [
					{ username: loginDto.usernameOrEmail },
					{ email: loginDto.usernameOrEmail },
				],
			});
		});

		it('should throw HttpException if user not found', async () => {
			mockUserModel.findOne.mockResolvedValue(null);

			await expect(service.signIn(loginDto)).rejects.toThrow(
				new HttpException(
					'Invalid username/email or password',
					HttpStatus.UNAUTHORIZED,
				),
			);
		});

		it('should throw HttpException if password is invalid', async () => {
			mockUserModel.findOne.mockResolvedValue({
				...mockUser,
				password: await argon2.hash('differentpassword'),
			});

			await expect(service.signIn(loginDto)).rejects.toThrow(
				new HttpException(
					'Invalid username/email or password',
					HttpStatus.UNAUTHORIZED,
				),
			);
		});
	});
});
