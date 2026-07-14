declare global {
	namespace Express {
		interface Request {
			user?: any;
			validatedUserId?: string;
			event?: any;
		}
	}
}

export {};
