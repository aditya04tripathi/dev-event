export interface Booking {
	_id: string;
	eventId: string;
	name: string;
	email: string;
	qrCode: string;
	checkedInAt?: string;
	createdAt: string;
	updatedAt: string;
}
