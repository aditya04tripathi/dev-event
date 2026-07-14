export interface Booking {
	_id: string;
	event: {
		_id: string;
		title: string;
		slug: string;
		description: string;
		overview: string;
		image: string;
		venue: string;
		location: string;
		date: string;
		time: string;
		mode: 'online' | 'offline' | 'hybrid';
		audience: string;
		organizer: {
			_id: string;
			fullName: string;
			username: string;
			email: string;
			avatar: string;
			roles: string[];
		};
		tags: string[];
		agenda: string[];
		createdAt: string;
		updatedAt: string;
	};
	name: string;
	email: string;
	checkedInAt?: string;
	createdAt: string;
	updatedAt: string;
}
