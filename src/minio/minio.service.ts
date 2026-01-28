import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { EnvService } from '../env/env.service';

@Injectable()
export class MinioService implements OnModuleInit {
	private minioClient: Minio.Client;
	private logger = new Logger(MinioService.name);

	constructor(private readonly envService: EnvService) {
		let endpoint = this.envService.MinioEndpoint;
		let useSSL = false;
		if (endpoint.startsWith('http://')) {
			endpoint = endpoint.replace('http://', '');
			useSSL = false;
		} else if (endpoint.startsWith('https://')) {
			endpoint = endpoint.replace('https://', '');
			useSSL = true;
		}
		let host = endpoint;
		let port = 9000;
		if (endpoint.includes(':')) {
			const parts = endpoint.split(':');
			host = parts[0];
			port = parseInt(parts[1], 10);
		}
		// Prefer MINIO_ACCESS_KEY/SECRET_KEY, fallback to ROOT_USER/ROOT_PASSWORD
		const accessKey =
			this.envService.MinioAccessKey || this.envService.MinioRootUser;
		const secretKey =
			this.envService.MinioSecretKey || this.envService.MinioRootPassword;
		this.minioClient = new Minio.Client({
			endPoint: host,
			port,
			useSSL,
			accessKey,
			secretKey,
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
