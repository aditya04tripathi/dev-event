export interface ApiResponse<T, E = string> {
	success: boolean;
	data?: T;
	error?: E;
	statusCode: number;
}
