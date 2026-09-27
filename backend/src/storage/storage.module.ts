import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ImageCompressionService } from './image-compression.service';

@Global()
@Module({
	providers: [StorageService, ImageCompressionService],
	exports: [StorageService, ImageCompressionService],
})
export class StorageModule {}
