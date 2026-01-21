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
    // We can't really initialize useBookEvent without eventId if we follow the hook pattern exactly
    // Let's check use-bookings.ts

    // Checking use-bookings.ts content:
    // export const useBookEvent = (eventId: string) => { ... }
    // This hook requires eventId at initialization! 

    // We need to refactor use-bookings.ts to be generic like useUpdateEvent
    // OR we just expose the hook function itself in the context.

    // Since the user wants "Contexts", usually it implies state or "Service instance".
    // Passing the hook function itself is the safest architectural pattern here 
    // if we don't want to refactor everything to "late binding".

    // HOWEVER, for consistency with EventContext where I refactored useUpdateEvent,
    // I should refactor useBookEvent, useCheckIn, etc. to take eventId in mutate().

    // But wait, useParticipants is a QUERY. Queries need keys.
    // We absolutely should expose useParticipants as the HOOK function.

    // So for consistency, let's just expose the logic/hooks, NOT the instantiated mutations 
    // unless we refactor all mutations to be generic. 

    // Refactoring all mutations to be generic (eventId in variable) is actually better for reusability.
    // I will refactor use-bookings.ts first. (See next tool call)

    return (
        <BookingContext.Provider value={null as any}>
            {children}
        </BookingContext.Provider>
    )
}
