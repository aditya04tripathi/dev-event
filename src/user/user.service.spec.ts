import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserService } from './user.service';
import { User } from './user.schema';

describe('UserService', () => {
	let service: UserService;
	let userModel: Model<User>;

	const mockUsers = [
		{
			_id: 'user1',
			username: 'user1',
			email: 'user1@example.com',
			fullName: 'User One',
			role: 'user',
		},
		{
			_id: 'user2',
			username: 'user2',
			email: 'user2@example.com',
			fullName: 'User Two',
			role: 'user',
		},
	];

	const mockUserModel = {
		find: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: User.name,
					useValue: mockUserModel,
				},
			],
		}).compile();

		service = module.get<UserService>(UserService);
		userModel = module.get<Model<User>>(User.name);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('findAll', () => {
		it('should return all users without passwords', async () => {
			const mockSelect = jest.fn().mockResolvedValue(mockUsers);
			mockUserModel.find.mockReturnValue({ select: mockSelect });

			const result = await service.findAll();

			expect(result).toEqual(mockUsers);
			expect(mockUserModel.find).toHaveBeenCalled();
			expect(mockSelect).toHaveBeenCalledWith('-password');
		});

		it('should return empty array if no users exist', async () => {
			const mockSelect = jest.fn().mockResolvedValue([]);
			mockUserModel.find.mockReturnValue({ select: mockSelect });

			const result = await service.findAll();

			expect(result).toEqual([]);
			expect(mockUserModel.find).toHaveBeenCalled();
		});
	});
});
