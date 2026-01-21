import type { ApiResponse, Booking, Event, Participant, User } from "./";

type SignUpResponse = {
	token: string;
	user: User;
};

type SignInResponse = {
	token: string;
	user: User;
};

type UserAllResponse = {
	user: User[];
};

type EventResponse = {
	events: Event[];
	totalEvents: number;
	totalPages: number;
	currentPage: number;
	nextPage: number | null;
	prevPage: number | null;
};

type BookingResponse = {
	id: string;
	name: string;
	email: string;
	eventTitle: string;
	checkedInAt: string;
};

type BookingParticipantsResponse = {
	participants: Participant[];
	totalParticipants: number;
	currentPage: number;
	totalPages: number;
};

export type ApiSignUpResponse = ApiResponse<SignUpResponse>;
export type ApiSignInResponse = ApiResponse<SignInResponse>;

export type ApiUserAllResponse = ApiResponse<UserAllResponse>;
export type ApiUserMeResponse = ApiResponse<User>;

export type ApiGetEventResponse = ApiResponse<EventResponse>;
export type ApiGetOneEventResponse = ApiResponse<Event>;
export type ApiPostEventResponse = ApiResponse<Event>;
export type ApiPatchEventResponse = ApiResponse<Event>;
export type ApiDeleteEventResponse = ApiResponse<string>;
export type ApiGetOrganizerEventsResponse = ApiResponse<EventResponse>;

export type ApiPostBookingResponse = ApiResponse<Booking>;
export type ApiPostBookingCheckInResponse = ApiResponse<BookingResponse>;
export type ApiGetBookingParticipantsResponse =
	ApiResponse<BookingParticipantsResponse>;
export type ApiDeleteBookingResponse = ApiResponse<string>;
export type ApiPostBookingResendQr = ApiResponse<{
	_id: string;
	eventId: string;
	name: string;
	email: string;
	qrCode: string;
	checkedInAt: string;
	createdAt: string;
	updatedAt: string;
}>;
