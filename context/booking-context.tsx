"use client";

import { createContext, useContext, ReactNode } from "react";
import {
    useParticipants,
    useBookEvent,
    useCheckIn,
    useResendQRCode,
    useRemoveParticipant,
} from "@/hooks/api/use-bookings";

interface BookingContextType {
    useParticipants: typeof useParticipants;
    bookEvent: ReturnType<typeof useBookEvent>;
    checkIn: ReturnType<typeof useCheckIn>;
    resendQRCode: ReturnType<typeof useResendQRCode>;
    removeParticipant: ReturnType<typeof useRemoveParticipant>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
    // Now these hooks are generic!
    const bookEventMutation = useBookEvent();
    const checkInMutation = useCheckIn();
    const resendQRCodeMutation = useResendQRCode();
    const removeParticipantMutation = useRemoveParticipant();

    return (
        <BookingContext.Provider
            value={{
                useParticipants,
                bookEvent: bookEventMutation,
                checkIn: checkInMutation,
                resendQRCode: resendQRCodeMutation,
                removeParticipant: removeParticipantMutation,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
}

export function useBookingContext() {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error("useBookingContext must be used within a BookingProvider");
    }
    return context;
}
