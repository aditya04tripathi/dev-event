import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './utils/filters/global-exception.filter';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';
import { EnvService } from './env/env.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalInterceptors(new ResponseInterceptor());

	const config = new DocumentBuilder()
		.setTitle('DevEvent RESTful API')
		.setDescription(
			'This is the API for DevEvent website and the mobile application.',
		)
		.setVersion('1.0')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			enableDebugMessages: process.env.NODE_ENV !== 'production',
		}),
	);

	const envService = app.get(EnvService);
	await app.listen(envService.Port);
}

bootstrap();
