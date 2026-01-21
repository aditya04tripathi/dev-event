import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from 'src/types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		const errorMessage =
			exception instanceof HttpException
				? exception.getResponse()
				: 'Internal server error';

		const message =
			typeof errorMessage === 'object' &&
			errorMessage !== null &&
			'message' in errorMessage
				? (errorMessage as any).message
				: errorMessage;

		const apiResponse: ApiResponse<null, string | string[]> = {
			success: false,
			data: null,
			error: Array.isArray(message)
				? message
				: typeof message === 'string'
					? message
					: String(message),
			statusCode: status,
		};

		response.status(status).json(apiResponse);
	}
}
