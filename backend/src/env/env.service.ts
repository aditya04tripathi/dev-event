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

	get StorageEndpoint(): string {
		return (
			this.get<string>('STORAGE_ENDPOINT') ||
			'http://seaweedfs:8888'
		);
	}

	get StoragePublicUrl(): string {
		return (
			this.get<string>('STORAGE_PUBLIC_URL') ||
			'https://devevent.adityatripathi.dev/api/storage'
		);
	}

	get StorageBucketName(): string {
		return (
			this.get<string>('STORAGE_BUCKET_NAME') ||
			'dev-event-bucket'
		);
	}

	get MinioEndpoint(): string {
		return this.StorageEndpoint;
	}

	get MinioPublicUrl(): string {
		return this.StoragePublicUrl;
	}

	get MinioBucketName(): string {
		return this.StorageBucketName;
	}

	get CorsOrigins(): string[] {
		const raw = this.get<string>('CORS_ORIGINS');
		if (!raw) {
			return ['https://devevent.adityatripathi.dev'];
		}
		return raw
			.split(',')
			.map((origin) => origin.trim())
			.filter(Boolean);
	}
}
