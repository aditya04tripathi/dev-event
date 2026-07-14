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

	private getPublicBaseUrl(): string {
		let host =
			this.envService.MinioPublicUrl || this.envService.MinioEndpoint;
		if (!host.startsWith('http')) {
			host = `http://${host}`;
		}
		if (host.endsWith('/')) {
			host = host.slice(0, -1);
		}
		return host;
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

		const policy = {
			Version: '2012-10-17',
			Statement: [
				{
					Effect: 'Allow',
					Principal: { AWS: ['*'] },
					Action: ['s3:GetObject'],
					Resource: [`arn:aws:s3:::${bucketName}/*`],
				},
			],
		};
		await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
		this.logger.log(`Bucket policy set to public for '${bucketName}'.`);
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

		return `${this.getPublicBaseUrl()}/${bucketName}/${fileName}`;
	}

	async getFileUrl(fileName: string): Promise<string> {
		const bucketName = this.envService.MinioBucketName;
		return `${this.getPublicBaseUrl()}/${bucketName}/${fileName}`;
	}
}
