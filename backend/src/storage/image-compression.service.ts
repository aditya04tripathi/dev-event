import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';

export interface CompressionOptions {
	maxWidth?: number;
	maxHeight?: number;
	quality?: number;
	format?: 'webp' | 'jpeg' | 'png' | 'avif';
}

export interface CompressedImageResult {
	buffer: Buffer;
	mimetype: string;
	filename: string;
	originalSize: number;
	compressedSize: number;
	savingsPercent: number;
}

@Injectable()
export class ImageCompressionService {
	private readonly logger = new Logger(ImageCompressionService.name);

	private readonly supportedImageMimes = new Set([
		'image/jpeg',
		'image/jpg',
		'image/png',
		'image/webp',
		'image/tiff',
		'image/avif',
		'image/bmp',
	]);

	isCompressibleImage(mimetype: string): boolean {
		return this.supportedImageMimes.has(mimetype?.toLowerCase());
	}

	async compress(
		buffer: Buffer,
		originalname: string,
		mimetype: string,
		options: CompressionOptions = {},
	): Promise<CompressedImageResult> {
		const originalSize = buffer.length;

		// Skip compression for non-image or vector SVG files
		if (!this.isCompressibleImage(mimetype)) {
			return {
				buffer,
				mimetype,
				filename: originalname,
				originalSize,
				compressedSize: originalSize,
				savingsPercent: 0,
			};
		}

		const maxWidth = options.maxWidth ?? 1920;
		const maxHeight = options.maxHeight ?? 1080;
		const quality = options.quality ?? 80;
		const targetFormat = options.format ?? 'webp';

		try {
			let pipeline = sharp(buffer)
				.rotate() // auto-orient based on EXIF before stripping
				.resize({
					width: maxWidth,
					height: maxHeight,
					fit: 'inside',
					withoutEnlargement: true,
				});

			let outputMime = mimetype;
			let newExtension = 'webp';

			switch (targetFormat) {
				case 'webp':
					pipeline = pipeline.webp({ quality, effort: 4 });
					outputMime = 'image/webp';
					newExtension = 'webp';
					break;
				case 'avif':
					pipeline = pipeline.avif({ quality });
					outputMime = 'image/avif';
					newExtension = 'avif';
					break;
				case 'jpeg':
					pipeline = pipeline.jpeg({ quality, mozjpeg: true });
					outputMime = 'image/jpeg';
					newExtension = 'jpg';
					break;
				case 'png':
					pipeline = pipeline.png({ quality, compressionLevel: 8 });
					outputMime = 'image/png';
					newExtension = 'png';
					break;
			}

			const compressedBuffer = await pipeline.toBuffer();
			const compressedSize = compressedBuffer.length;
			const savingsPercent = Math.max(
				0,
				Number(
					(((originalSize - compressedSize) / originalSize) * 100).toFixed(1),
				),
			);

			// Generate clean filename with updated extension
			const baseName = originalname.replace(/\.[^/.]+$/, '');
			const newFilename = `${baseName}.${newExtension}`;

			this.logger.log(
				`🗜️ Compressed image [${originalname}]: ${(originalSize / 1024).toFixed(1)}KB -> ${(compressedSize / 1024).toFixed(1)}KB (${savingsPercent}% reduction)`,
			);

			return {
				buffer: compressedBuffer,
				mimetype: outputMime,
				filename: newFilename,
				originalSize,
				compressedSize,
				savingsPercent,
			};
		} catch (error) {
			this.logger.warn(
				`Failed to compress image [${originalname}], using original buffer: ${error.message}`,
			);
			return {
				buffer,
				mimetype,
				filename: originalname,
				originalSize,
				compressedSize: originalSize,
				savingsPercent: 0,
			};
		}
	}
}
