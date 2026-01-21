"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MailIcon, UserIcon, CalendarIcon, ShieldIcon, MapPinIcon, TicketIcon, ArrowRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBookings } from "@/hooks/use-bookings";
import Link from "next/link";

export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    // ... (existing code for ProfilePage render, up to BookingsList usage)
    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">Loading...</div>;
    }

    if (!user) {
        return <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">Please login to view your profile.</div>;
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-muted-foreground mt-1">Manage your account information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-1 border-primary/10 bg-background/50 backdrop-blur-sm shadow-xl h-fit">
                    <CardContent className="pt-6 flex flex-col items-center">
                        <Avatar className="h-24 w-24 mb-4 border-2 border-primary/20">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-bold text-center">{user.fullName}</h2>
                        <p className="text-sm text-muted-foreground text-center mb-4">@{user.username}</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {user.roles.map((role) => (
                                <Badge key={role} variant="secondary" className="capitalize">
                                    {role}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 border-primary/10 bg-background/50 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle>Account Details</CardTitle>
                        <CardDescription>Your personal information and account settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <MailIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Email Address</p>
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <ShieldIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Account Type</p>
                                <p className="text-muted-foreground capitalize">
                                    {user.roles.join(", ")}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <CalendarIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Joined On</p>
                                <p className="text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric"
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {(user.roles.includes("user") || user.roles.includes("admin")) && (
                <Card className="mt-8 border-primary/10 bg-background/50 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle>My Bookings</CardTitle>
                        <CardDescription>Events you have registered for</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BookingsList />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function BookingsList() {
    const { data: bookings, isLoading, error } = useBookings();

    if (isLoading) {
        return <div className="text-center py-8 text-muted-foreground">Loading bookings...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-destructive">Failed to load bookings.</div>;
    }

    if (!bookings || bookings.length === 0) {
        return (
            <div className="p-8 text-center border-2 border-dashed rounded-lg">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-center">
                    You haven't booked any events yet.
                </p>
                <Link href="/events" className="mt-4 inline-block">
                    <Button variant="outline">Browse Events</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {bookings.map((booking: any) => (
                <div key={booking._id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors gap-4">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-md h-fit">
                            <TicketIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{booking.eventId.title}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-3.5 w-3.5" />
                                    {new Date(booking.eventId.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPinIcon className="h-3.5 w-3.5" />
                                    {booking.eventId.location}
                                </span>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                                Booking ID: {booking._id.slice(-6).toUpperCase()} • Registered on {new Date(booking.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {booking.checkedInAt ? (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Checked In</Badge>
                        ) : (
                            <Badge variant="outline">Registered</Badge>
                        )}
                        <Link href={`/profile/ticket/${booking._id}`} className="flex-1 md:flex-none">
                            <Button size="sm" className="w-full">
                                View Ticket
                                <ArrowRightIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
