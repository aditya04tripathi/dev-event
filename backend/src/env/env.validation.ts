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

	@IsOptional()
	@IsString()
	STORAGE_ENDPOINT?: string;

	@IsOptional()
	@IsString()
	STORAGE_PUBLIC_URL?: string;

	@IsOptional()
	@IsString()
	STORAGE_BUCKET_NAME?: string;

	@IsOptional()
	@IsString()
	CORS_ORIGINS: string;
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
