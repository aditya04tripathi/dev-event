"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MailIcon,
  CalendarIcon,
  ShieldIcon,
  MapPinIcon,
  TicketIcon,
  ArrowRightIcon,
  LogIn,
  Settings,
  CalendarX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookings } from "@/hooks/use-bookings";
import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="section-sm">
        <div className="container-tight">
          <div className="mb-10">
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-6 text-center px-4">
        <div className="rounded-full bg-muted p-5">
          <LogIn className="size-10 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold mb-2">Sign in required</h1>
          <p className="text-muted-foreground max-w-sm">
            Please sign in to view your profile and manage your bookings.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/auth/login">
            <LogIn className="mr-2 size-4" />
            Sign In
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="section-sm">
      <div className="container-tight">
        {/* Header */}
        <BlurFade delay={0.05}>
          <div className="mb-10 h-full">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              My Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your account and view your event bookings
            </p>
          </div>
        </BlurFade>

        {/* Profile Grid */}
        <div className="h-full grid lg:grid-cols-2 gap-8">
          {/* Avatar Card */}
          <BlurFade delay={0.1}>
            <div className="lg:col-span-1">
              <div className="border border-border rounded-xl p-6 flex flex-col items-center bg-card">
                <Avatar className="size-24 mb-4 ring-4 ring-background shadow-lg">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {user.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold text-lg text-center">
                  {user.fullName}
                </h2>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  @{user.username}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {user.roles.map((role) => (
                    <Badge
                      key={role}
                      variant="secondary"
                      className="capitalize"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Details Card */}
          <BlurFade delay={0.15}>
            <div className="lg:col-span-2">
              <div className="border border-border rounded-xl p-6 bg-card h-full">
                <h3 className="font-semibold mb-6">Account Details</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-primary/10">
                      <MailIcon className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email Address</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-primary/10">
                      <ShieldIcon className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Account Type</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {user.roles.join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-primary/10">
                      <CalendarIcon className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Joined On</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Bookings Section */}
        {(user.roles.includes("user") || user.roles.includes("admin")) && (
          <BlurFade delay={0.2}>
            <div className="mt-10 border border-border rounded-xl p-6 bg-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold">My Bookings</h3>
                  <p className="text-sm text-muted-foreground">
                    Events you have registered for
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/events">Browse Events</Link>
                </Button>
              </div>
              <BookingsList />
            </div>
          </BlurFade>
        )}
      </div>
    </div>
  );
}

function BookingsList() {
  const { data: bookings, isLoading, error } = useBookings();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex gap-4 p-4 rounded-lg border border-border"
          >
            <Skeleton className="size-12 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-sm text-destructive rounded-lg bg-destructive/5 border border-destructive/20">
        Failed to load bookings. Please try again later.
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-border rounded-xl">
        <div className="rounded-full bg-muted p-4 w-fit mx-auto mb-4">
          <CalendarX className="size-8 text-muted-foreground" />
        </div>
        <h4 className="font-medium mb-1">No bookings yet</h4>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
          You haven&apos;t registered for any events yet. Browse our events to
          find something interesting.
        </p>
        <Button asChild variant="outline">
          <Link href="/events">Browse Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking: any) => (
        <div
          key={booking._id}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-border bg-background hover:shadow-md transition-shadow gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 shrink-0">
              <TicketIcon className="size-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">{booking.eventId.title}</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="size-3.5" />
                  {new Date(booking.eventId.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="size-3.5" />
                  {booking.eventId.location}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Booking ID: {booking._id.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {booking.checkedInAt ? (
              <Badge variant="success">Checked In</Badge>
            ) : (
              <Badge variant="outline">Registered</Badge>
            )}
            <Button asChild size="sm" className="flex-1 sm:flex-none">
              <Link href={`/profile/ticket/${booking._id}`}>
                View Ticket
                <ArrowRightIcon className="ml-2 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
