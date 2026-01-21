import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseWrapper } from 'src/types';

@Injectable()
export class ResponseInterceptor<T>
	implements NestInterceptor<T, ApiResponseWrapper<T, string>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<ApiResponseWrapper<T, string>> {
		return next.handle().pipe(
			map((data) => {
				const response = context.switchToHttp().getResponse();
				const statusCode = response.statusCode;

				if (
					data &&
					typeof data === 'object' &&
					'success' in data &&
					'statusCode' in data
				) {
					return {
						...data,
						data: data.success ? data.data : null,
						error: data.success ? null : data.error,
					};
				}

				return {
					success: true,
					data: data,
					error: null,
					statusCode,
				};
			}),
		);
	}
}
