import { plainToInstance } from 'class-transformer';
import {
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	validateSync,
} from 'class-validator';

export enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test',
}

export class EnvironmentVariables {
	@IsEnum(Environment)
	NODE_ENV: Environment = Environment.Development;

	@IsNumber()
	PORT: number = 3000;

	@IsString()
	JWT_SECRET: string;

	@IsString()
	DATABASE_URL: string;

	@IsString()
	MINIO_ENDPOINT: string;

	@IsOptional()
	@IsString()
	MINIO_ACCESS_KEY: string;

	@IsOptional()
	@IsString()
	MINIO_SECRET_KEY: string;

	@IsString()
	MINIO_BUCKET_NAME: string;

	@IsString()
	MINIO_ROOT_USER: string;

	@IsString()
	MINIO_ROOT_PASSWORD: string;
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	});
	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}
	return validatedConfig;
}
