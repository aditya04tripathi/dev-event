import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseWrapper } from 'src/types';

export const ApiWrappedResponse = <TModel extends Type<any>>(
	model?: TModel,
	status: number = HttpStatus.OK,
	description?: string,
	isArray: boolean = false,
) => {
	const decorators = [
		ApiExtraModels(ApiResponseWrapper),
		ApiResponse({
			status,
			description,
			schema: {
				allOf: [
					{ $ref: getSchemaPath(ApiResponseWrapper) },
					...(model
						? [
								{
									properties: {
										data: isArray
											? {
													type: 'array',
													items: { $ref: getSchemaPath(model) },
												}
											: { $ref: getSchemaPath(model) },
									},
								},
							]
						: []),
				],
			},
		}),
	];
	if (model) {
		decorators.push(ApiExtraModels(model));
	}
	return applyDecorators(...decorators);
};
