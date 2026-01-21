import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseWrapper<T, E = any> {
	@ApiProperty({ example: true })
	success: boolean;

	@ApiProperty({ required: false })
	data?: T;

	@ApiProperty({ required: false })
	error?: E;

	@ApiProperty({ example: 200 })
	statusCode: number;
}

export type ApiResponse<T, E = any> = ApiResponseWrapper<T, E>;
