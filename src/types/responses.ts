import type { ApiResponse } from './api';

export interface UserResponse {
	_id: string;
	username: string;
	email: string;
	fullName: string;
	roles: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface AuthResponse {
	token: string;
	user: UserResponse;
}

export interface EventResponse {
	_id: string;
	title: string;
	slug: string;
	description: string;
	image: string;
	venue: string;
	location: string;
	date: string;
	time: string;
	mode: string;
	audience: string;
	agenda: AgendaItem[];
	organizerId: string;
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface AgendaItem {
	time: string;
	activity: string;
}

export interface PaginatedEventResponse {
	events: EventResponse[];
	totalEvents: number;
	totalPages: number;
	currentPage: number;
	nextPage: number | null;
	prevPage: number | null;
}

// Booking
export interface BookingResponse {
	_id: string;
	eventId: string;
	name: string;
	email: string;
	qrCode: string;
	checkedInAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface CheckInResponse {
	id: string;
	name: string;
	email: string;
	eventTitle: string;
	checkedInAt: string;
}

export interface ParticipantResponse {
	_id: string;
	name: string;
	email: string;
	checkedInAt?: Date;
	createdAt: Date;
}

export interface PaginatedParticipantResponse {
	participants: ParticipantResponse[];
	totalParticipants: number;
	currentPage: number;
	totalPages: number;
}

export type { ApiResponse };
