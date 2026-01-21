import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { EnvService } from '../env/env.service';

@Injectable()
export class MinioService implements OnModuleInit {
	private minioClient: Minio.Client;
	private logger = new Logger(MinioService.name);

	constructor(private readonly envService: EnvService) {
		this.minioClient = new Minio.Client({
			endPoint: this.envService.MinioEndpoint,
			port: 9000,
			useSSL: false,
			accessKey: this.envService.MinioAccessKey,
			secretKey: this.envService.MinioSecretKey,
		});
	}

	async onModuleInit() {
		const bucketName = this.envService.MinioBucketName;
		const exists = await this.minioClient.bucketExists(bucketName);
		if (!exists) {
			await this.minioClient.makeBucket(bucketName);
			this.logger.log(`Bucket '${bucketName}' created.`);
		} else {
			this.logger.log(`Bucket '${bucketName}' already exists.`);
		}
	}

	async uploadFile(file: Express.Multer.File): Promise<string> {
		return this.uploadBuffer(file.buffer, file.originalname, file.mimetype);
	}

	async uploadBuffer(
		buffer: Buffer,
		originalname: string,
		mimetype: string,
	): Promise<string> {
		const bucketName = this.envService.MinioBucketName;
		const fileName = `${Date.now()}-${originalname}`;

		await this.minioClient.putObject(
			bucketName,
			fileName,
			buffer,
			buffer.length,
			{
				'Content-Type': mimetype,
			},
		);

		return fileName;
	}

	async getPresignedUrl(fileName: string): Promise<string> {
		const bucketName = this.envService.MinioBucketName;
		return await this.minioClient.presignedGetObject(
			bucketName,
			fileName,
			24 * 60 * 60,
		);
	}

	async getFile(fileName: string) {
		const bucketName = this.envService.MinioBucketName;
		return await this.minioClient.getObject(bucketName, fileName);
	}
}
