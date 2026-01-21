import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

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
    queryFn: async () => {
      const { data } = await api.get<any>("/bookings/my-bookings");
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.data)) return data.data;
      return [];
    },
  });
};

export const useBookingTicket = (id: string) => {
  return useQuery({
    queryKey: ["booking-ticket", id],
    queryFn: async () => {
      const { data } = await api.get<any>(`/bookings/ticket/${id}`);
      if (data && data.data)
        return data.data as Booking & {
          eventTitle: string;
          eventDate: string;
          eventLocation: string;
        };
      return data;
    },
    enabled: !!id,
  });
};
