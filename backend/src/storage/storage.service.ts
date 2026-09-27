import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import {
	CompressionOptions,
	ImageCompressionService,
} from './image-compression.service';

@Injectable()
export class StorageService implements OnModuleInit {
	private readonly logger = new Logger(StorageService.name);

	constructor(
		private readonly envService: EnvService,
		private readonly imageCompressionService: ImageCompressionService,
	) {}

	private getFilerBaseUrl(): string {
		const endpoint =
			this.envService.StorageEndpoint ||
			'http://seaweedfs:8888';
		return endpoint.replace(/\/$/, '');
	}

	private getPublicBaseUrl(): string {
		let host =
			this.envService.StoragePublicUrl ||
			this.envService.StorageEndpoint ||
			'http://seaweedfs:8888';

		if (!host.startsWith('http')) {
			host = `http://${host}`;
		}
		return host.replace(/\/$/, '');
	}

	private getBucketName(): string {
		return this.envService.StorageBucketName || 'dev-event-bucket';
	}

	async onModuleInit() {
		const filerUrl = this.getFilerBaseUrl();
		const bucketName = this.getBucketName();

		try {
			// Check if SeaweedFS Filer is reachable and ensure bucket folder exists
			const checkRes = await fetch(`${filerUrl}/${bucketName}/`, {
				method: 'GET',
			});

			if (checkRes.status === 404) {
				// Create directory in SeaweedFS Filer
				const createRes = await fetch(`${filerUrl}/${bucketName}/`, {
					method: 'POST',
				});
				if (createRes.ok) {
					this.logger.log(
						`Created SeaweedFS collection/bucket '${bucketName}'`,
					);
				}
			} else {
				this.logger.log(
					`SeaweedFS storage bucket '${bucketName}' is ready at ${filerUrl}`,
				);
			}
		} catch (error) {
			this.logger.warn(
				`Could not connect to SeaweedFS at ${filerUrl} during startup: ${error.message}. Will retry on requests.`,
			);
		}
	}

	/**
	 * Upload an Express Multer file, automatically applying image compression if applicable.
	 */
	async uploadFile(
		file: Express.Multer.File,
		options?: CompressionOptions,
	): Promise<string> {
		return this.uploadBuffer(
			file.buffer,
			file.originalname,
			file.mimetype,
			options,
		);
	}

	/**
	 * Upload a raw buffer, automatically optimizing images through the compression hook.
	 */
	async uploadBuffer(
		rawBuffer: Buffer,
		originalname: string,
		mimetype: string,
		options?: CompressionOptions,
	): Promise<string> {
		// 1. Run image compression hook
		const processed = await this.imageCompressionService.compress(
			rawBuffer,
			originalname,
			mimetype,
			options,
		);

		const bucketName = this.getBucketName();
		const sanitizedName = processed.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
		const fileName = `${Date.now()}-${sanitizedName}`;
		const filerUrl = this.getFilerBaseUrl();
		const targetUrl = `${filerUrl}/${bucketName}/${fileName}`;

		// 2. Upload to SeaweedFS Filer HTTP API
		const response = await fetch(targetUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': processed.mimetype,
				'Content-Length': String(processed.buffer.length),
			},
			body: new Uint8Array(processed.buffer),
		});

		if (!response.ok && response.status !== 201 && response.status !== 204) {
			throw new Error(
				`SeaweedFS upload failed with status ${response.status}: ${response.statusText}`,
			);
		}

		this.logger.log(`Uploaded file '${fileName}' to SeaweedFS`);
		return `${this.getPublicBaseUrl()}/${bucketName}/${fileName}`;
	}

	/**
	 * Retrieve public file URL for a given filename
	 */
	async getFileUrl(fileName: string): Promise<string> {
		if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
			return fileName;
		}
		const bucketName = this.getBucketName();
		return `${this.getPublicBaseUrl()}/${bucketName}/${fileName}`;
	}

	/**
	 * Delete a file from SeaweedFS
	 */
	async deleteFile(fileName: string): Promise<boolean> {
		const bucketName = this.getBucketName();
		const cleanName = fileName.replace(/^.*[\\/]/, '');
		const filerUrl = this.getFilerBaseUrl();
		const targetUrl = `${filerUrl}/${bucketName}/${cleanName}`;

		try {
			const res = await fetch(targetUrl, { method: 'DELETE' });
			return res.ok || res.status === 404;
		} catch (error) {
			this.logger.warn(
				`Failed to delete file '${cleanName}' from SeaweedFS: ${error.message}`,
			);
			return false;
		}
	}
}
