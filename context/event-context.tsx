"use client";

import { createContext, useContext, ReactNode } from "react";
import {
    useEvents,
    useEvent,
    useMyEvents,
    useCreateEvent,
    useUpdateEvent,
    useDeleteEvent,
} from "@/hooks/api/use-events";

interface EventContextType {
    useEvents: typeof useEvents;
    useEvent: typeof useEvent;
    useMyEvents: typeof useMyEvents;
    createEvent: ReturnType<typeof useCreateEvent>;
    updateEvent: ReturnType<typeof useUpdateEvent>;
    deleteEvent: ReturnType<typeof useDeleteEvent>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
    const createEventMutation = useCreateEvent();
    const updateEventMutation = useUpdateEvent();
    const deleteEventMutation = useDeleteEvent();

    return (
        <EventContext.Provider
            value={{
                useEvents,
                useEvent,
                useMyEvents,
                createEvent: createEventMutation,
                updateEvent: updateEventMutation,
                deleteEvent: deleteEventMutation,
            }}
        >
            {children}
        </EventContext.Provider>
    );
}

export function useEventContext() {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error("useEventContext must be used within an EventProvider");
    }
    return context;
}
