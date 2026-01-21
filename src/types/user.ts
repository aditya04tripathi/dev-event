export enum Role {
	USER = 'user',
	ORGANIZER = 'organizer',
	ADMIN = 'admin',
}

export interface User {
	_id: string;
	fullName: string;
	username: string;
	email: string;
	roles: Role[];
	createdAt: string;
	updatedAt: string;
}
