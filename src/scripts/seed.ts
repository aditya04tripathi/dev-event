import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EventService } from '../event/event.service';

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(AppModule);
	const eventService = app.get(EventService);

	console.log('Seeding events...');
	try {
		await eventService.seedEvents();
		console.log('Seeding completed successfully!');
	} catch (error) {
		console.error('Seeding failed:', error);
	} finally {
		await app.close();
		process.exit();
	}
}

bootstrap();
