export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  statusCode: number;
}

export interface UserResponse {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
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
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizerId: string | UserResponse;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedEventResponse {
  events: EventResponse[];
  totalEvents: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface BookingResponse {
  _id: string;
  eventId: string;
  name: string;
  email: string;
  qrCode: string;
  checkedInAt?: string;
  createdAt: string;
  updatedAt: string;
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
  checkedInAt?: string;
  createdAt: string;
}

export interface PaginatedParticipantResponse {
  participants: ParticipantResponse[];
  totalParticipants: number;
  currentPage: number;
  totalPages: number;
}

export interface CreateEventRequest {
  title: string;
  slug: string;
  description: string;
  overview: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  organizer: string;
  tags: string;
  agenda: string;
  image: File;
}

export interface UpdateEventRequest {
  title?: string;
  slug?: string;
  description?: string;
  overview?: string;
  venue?: string;
  location?: string;
  date?: string;
  time?: string;
  mode?: string;
  audience?: string;
  organizer?: string;
  tags?: string;
  agenda?: string;
  image?: File;
}
