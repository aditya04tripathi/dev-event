"use client";

import { useUserInfo } from "@/hooks/api/use-users";
import { useEventContext } from "@/context/event-context";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import EventCard from "@/components/event/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MailIcon, MapPinIcon } from "lucide-react";

export default function OrganizerPublicPage() {
    const { id } = useParams() as { id: string };
    const { useEvents } = useEventContext();
    const { data: user, isLoading: userLoading } = useUserInfo(id);
    const { data: eventsData, isLoading: eventsLoading } = useEvents({ organizerId: id, limit: 10 });

    if (userLoading) {
        return (
            <div className="container mx-auto py-12 px-4 space-y-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left animate-pulse">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <div className="space-y-4 flex-1">
                        <Skeleton className="h-10 w-64 mx-auto md:mx-0" />
                        <Skeleton className="h-6 w-full max-w-lg" />
                        <div className="flex gap-4 justify-center md:justify-start">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user || !user.roles.includes("organizer")) {
        return (
            <div className="container mx-auto py-24 px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">Organizer Not Found</h1>
                <p className="text-muted-foreground italic">The person you are looking for might not be an organizer or the account doesn't exist.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 space-y-12 max-w-7xl">
            {/* Organizer Header */}
            <section className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left bg-primary/5 p-8 rounded-3xl border border-primary/10">
                <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                    <AvatarFallback className="text-3xl">{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                        <h1 className="text-4xl font-bold">{user.fullName}</h1>
                        <Badge variant="secondary" className="px-3 py-1">Organizer</Badge>
                    </div>

                    <p className="text-lg text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                        <MailIcon className="h-5 w-5" />
                        {user.email}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center md:justify-start">
                        <span className="flex items-center gap-1.5">
                            <CalendarIcon className="h-4 w-4" />
                            Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-3xl font-bold tracking-tight">Events by {user.fullName.split(' ')[0]}</h2>
                    <Badge variant="outline" className="text-base py-1 px-4">{eventsData?.totalEvents || 0} Events</Badge>
                </div>

                {eventsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <Skeleton key={n} className="h-[400px] rounded-2xl" />
                        ))}
                    </div>
                ) : eventsData?.events.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
                        <p className="text-xl text-muted-foreground">This organizer hasn't published any events yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {eventsData?.events.map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
