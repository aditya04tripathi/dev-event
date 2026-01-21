import { Test, TestingModule } from '@nestjs/testing';
import { MinioService } from './minio.service';
import { EnvService } from '../env/env.service';
import * as Minio from 'minio';

jest.mock('minio', () => ({
	Client: jest.fn(),
}));

describe('MinioService', () => {
	let service: MinioService;
	let envService: EnvService;

	const mockEnvService = {
		MinioEndpoint: 'localhost',
		MinioAccessKey: 'minioadmin',
		MinioSecretKey: 'minioadmin',
		MinioBucketName: 'dev-event-bucket',
	};

	const mockMinioClient = {
		bucketExists: jest.fn(),
		makeBucket: jest.fn(),
		putObject: jest.fn(),
		presignedGetObject: jest.fn(),
	};

	beforeEach(async () => {
		(Minio.Client as jest.Mock).mockImplementation(() => mockMinioClient);

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MinioService,
				{
					provide: EnvService,
					useValue: mockEnvService,
				},
			],
		}).compile();

		service = module.get<MinioService>(MinioService);
		envService = module.get<EnvService>(EnvService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('onModuleInit', () => {
		it('should create bucket if it does not exist', async () => {
			mockMinioClient.bucketExists.mockResolvedValue(false);
			mockMinioClient.makeBucket.mockResolvedValue(undefined);

			await service.onModuleInit();

			expect(mockMinioClient.bucketExists).toHaveBeenCalledWith(
				'dev-event-bucket',
			);
			expect(mockMinioClient.makeBucket).toHaveBeenCalledWith(
				'dev-event-bucket',
			);
		});

		it('should not create bucket if it already exists', async () => {
			mockMinioClient.bucketExists.mockResolvedValue(true);

			await service.onModuleInit();

			expect(mockMinioClient.bucketExists).toHaveBeenCalledWith(
				'dev-event-bucket',
			);
			expect(mockMinioClient.makeBucket).not.toHaveBeenCalled();
		});
	});

	describe('uploadFile', () => {
		const mockFile = {
			originalname: 'test.jpg',
			buffer: Buffer.from('test'),
			mimetype: 'image/jpeg',
			size: 4,
		} as Express.Multer.File;

		it('should upload file and return filename', async () => {
			mockMinioClient.putObject.mockResolvedValue({});

			const result = await service.uploadFile(mockFile);

			expect(result).toMatch(/\.jpg$/);
			expect(mockMinioClient.putObject).toHaveBeenCalledWith(
				'dev-event-bucket',
				expect.stringMatching(/\.jpg$/),
				mockFile.buffer,
				mockFile.buffer.length,
				{
					'Content-Type': mockFile.mimetype,
				},
			);
		});

		it('should generate unique filename with timestamp', async () => {
			mockMinioClient.putObject.mockResolvedValue({});

			const result1 = await service.uploadFile(mockFile);
			// Add small delay to ensure different timestamp
			await new Promise((resolve) => setTimeout(resolve, 10));
			const result2 = await service.uploadFile(mockFile);

			expect(result1).not.toBe(result2);
		});
	});

	describe('getPresignedUrl', () => {
		it('should return presigned URL for object', async () => {
			const expectedUrl = 'https://presigned-url.com/test.jpg';
			mockMinioClient.presignedGetObject.mockResolvedValue(expectedUrl);

			const result = await service.getPresignedUrl('test.jpg');

			expect(result).toBe(expectedUrl);
			expect(mockMinioClient.presignedGetObject).toHaveBeenCalledWith(
				'dev-event-bucket',
				'test.jpg',
				24 * 60 * 60,
			);
		});

		it('should use default expiry of 24 hours', async () => {
			mockMinioClient.presignedGetObject.mockResolvedValue('url');

			await service.getPresignedUrl('test.jpg');

			expect(mockMinioClient.presignedGetObject).toHaveBeenCalledWith(
				'dev-event-bucket',
				'test.jpg',
				24 * 60 * 60,
			);
		});
	});
});
