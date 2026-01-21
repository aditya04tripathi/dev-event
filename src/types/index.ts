import { Document } from 'mongoose';

export type HydratedModel<T> = Document & T;

export type ApiResponse<T, E = string> = {
	success: boolean;
	data?: T;
	error?: E;
	statusCode: number;
};
