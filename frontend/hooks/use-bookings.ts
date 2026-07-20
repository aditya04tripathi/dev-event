import { useQuery } from "@tanstack/react-query";
import {
  getBookingTicketAction,
  listMyBookingsAction,
} from "@/lib/actions/bookings";

export interface Booking {
  _id: string;
  eventId: {
    _id: string;
    title: string;
    date: string;
    location: string;
    slug: string;
    image?: string;
  };
  name: string;
  email: string;
  checkedInAt?: string;
  createdAt: string;
  qrCode?: string;
}

export const useBookings = () => {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => listMyBookingsAction() as Promise<Booking[]>,
  });
};

export type BookingTicket = Booking & {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
};

export const useBookingTicket = (id: string) => {
  return useQuery({
    queryKey: ["booking-ticket", id],
    queryFn: () => getBookingTicketAction(id) as Promise<BookingTicket>,
    enabled: !!id,
  });
};
