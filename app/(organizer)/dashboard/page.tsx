"use client";

import { useEventContext } from "@/context/event-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, UsersIcon, EditIcon, TrashIcon, CalendarIcon, MapPinIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStats } from "./components";

export default function OrganizerDashboard() {
    const { useMyEvents, deleteEvent } = useEventContext();
    const { data, isLoading } = useMyEvents();
    const deleteMutation = deleteEvent;

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this event?")) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    toast.success("Event deleted successfully");
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || "Failed to delete event");
                },
            });
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <div className="flex justify-between items-center mb-8">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    const events = data?.events || [];

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your events and participants</p>
                </div>
                <Link href="/dashboard/events/new">
                    <Button>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Create New Event
                    </Button>
                </Link>
            </div>

            <DashboardStats />

            {events.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 bg-muted/50 border-dashed">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle>No events yet</CardTitle>
                    <CardDescription className="mb-6">Start by creating your first awesome developer event.</CardDescription>
                    <Link href="/dashboard/events/new">
                        <Button variant="outline">Create Event</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <Card key={event._id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-primary/10">
                            <div className="relative h-40 w-full overflow-hidden">
                                <Image
                                    src={event.image || "/placeholder-event.png"}
                                    alt={event.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <span className="bg-background/80 backdrop-blur-md text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider border border-primary/10">
                                        {event.mode}
                                    </span>
                                </div>
                            </div>
                            <CardHeader className="p-4">
                                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                                <CardDescription className="flex items-center gap-1.5 mt-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    {new Date(event.date).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPinIcon className="h-3 w-3 mr-1.5 shrink-0" />
                                    <span className="line-clamp-1">{event.location}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between gap-2">
                                <Link href={`/dashboard/events/${event._id}/participants`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <UsersIcon className="h-3.5 w-3.5 mr-1.5" />
                                        Participants
                                    </Button>
                                </Link>
                                <div className="flex gap-2">
                                    {/* Edit logic would go to a new edit page */}
                                    <Link href={`/dashboard/events/edit/${event._id}`}>
                                        <Button variant="ghost" size="icon" className="h-9 w-9">
                                            <EditIcon className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(event._id)}
                                        disabled={deleteMutation.isPending}
                                    >
                                        {deleteMutation.isPending ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <TrashIcon className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
