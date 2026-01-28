import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.validation';

@Injectable()
export class EnvService {
	constructor(
		private configService: ConfigService<EnvironmentVariables, true>,
	) {}

	get<T>(key: keyof EnvironmentVariables): T {
		return this.configService.get(key, { infer: true });
	}

	get isDevelopment(): boolean {
		return this.get<string>('NODE_ENV') === 'development';
	}

	get isProduction(): boolean {
		return this.get<string>('NODE_ENV') === 'production';
	}

	get isTest(): boolean {
		return this.get<string>('NODE_ENV') === 'test';
	}

	get JwtSecret(): string {
		return this.get<string>('JWT_SECRET');
	}

	get DatabaseUrl(): string {
		return this.get<string>('DATABASE_URL');
	}

	get Port(): number {
		return this.get<number>('PORT');
	}

	get MinioEndpoint(): string {
		return this.get<string>('MINIO_ENDPOINT');
	}

	get MinioAccessKey(): string {
		return this.get<string>('MINIO_ACCESS_KEY');
	}

	get MinioSecretKey(): string {
		return this.get<string>('MINIO_SECRET_KEY');
	}

	get MinioBucketName(): string {
		return this.get<string>('MINIO_BUCKET_NAME');
	}

	get MinioRootUser(): string {
		return this.get<string>('MINIO_ROOT_USER');
	}

	get MinioRootPassword(): string {
		return this.get<string>('MINIO_ROOT_PASSWORD');
	}
}
