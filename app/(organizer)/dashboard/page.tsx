"use client";

import { useEventContext } from "@/context/event-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BlurFade } from "@/components/ui/blur-fade";
import Pagination from "@/components/shared/pagination";
import { useSearchParams } from "next/navigation";
import {
  PlusIcon,
  UsersIcon,
  EditIcon,
  TrashIcon,
  CalendarIcon,
  MapPinIcon,
  CalendarX,
  MoreVertical,
  ExternalLink,
  Video,
  Building2,
  Globe,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { DashboardStats } from "./components";
import { cn } from "@/lib/utils";

function getModeIcon(mode: string) {
  switch (mode.toLowerCase()) {
    case "online":
      return Video;
    case "offline":
    case "in-person":
      return Building2;
    default:
      return Globe;
  }
}

function getModeColor(mode: string) {
  switch (mode.toLowerCase()) {
    case "online":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "offline":
    case "in-person":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    default:
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
  }
}

export default function OrganizerDashboard() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const { useMyEvents, deleteEvent } = useEventContext();
  const { data, isLoading } = useMyEvents({ page, limit: 9 });
  const deleteMutation = deleteEvent;

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Event deleted successfully");
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Failed to delete event",
          );
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="section-sm">
        <div className="container-wide">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton className="h-9 w-48 mb-2" />
              <Skeleton className="h-5 w-72" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const events = data?.events || [];

  return (
    <div className="section-sm">
      <div className="container-wide">
        {/* Header */}
        <BlurFade delay={0.05}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Organizer Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your events and track participant engagement
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/dashboard/events/new">
                <PlusIcon className="mr-2 size-4" />
                Create Event
              </Link>
            </Button>
          </div>
        </BlurFade>

        {/* Stats */}
        <BlurFade delay={0.1}>
          <DashboardStats />
        </BlurFade>

        {/* Section Header */}
        <BlurFade delay={0.15}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Your Events</h2>
            <p className="text-sm text-muted-foreground">
              {data?.totalEvents || 0}{" "}
              {data?.totalEvents === 1 ? "event" : "events"}
            </p>
          </div>
        </BlurFade>

        {/* Events Grid */}
        {events.length === 0 ? (
          <BlurFade delay={0.2}>
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl bg-card/50">
              <div className="rounded-full bg-muted p-4 mb-4">
                <CalendarX className="size-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No events yet</h3>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                Start by creating your first developer event and share it with
                the community.
              </p>
              <Button asChild>
                <Link href="/dashboard/events/new">
                  <PlusIcon className="mr-2 size-4" />
                  Create Your First Event
                </Link>
              </Button>
            </div>
          </BlurFade>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event, index) => {
                const ModeIcon = getModeIcon(event.mode);
                return (
                  <BlurFade key={event._id} delay={0.2 + index * 0.05}>
                    <div className="border border-border rounded-xl overflow-hidden bg-card group hover:shadow-lg transition-shadow">
                      {/* Image */}
                      <div className="relative h-44 w-full overflow-hidden bg-muted">
                        <Image
                          src={event.image || "/placeholder-event.png"}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge
                          className={cn(
                            "absolute top-3 right-3 gap-1",
                            getModeColor(event.mode),
                          )}
                        >
                          <ModeIcon className="size-3" />
                          {event.mode}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold line-clamp-1 mb-2">
                          {event.title}
                        </h3>
                        <div className="space-y-1.5 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="size-3.5 shrink-0" />
                            <span>
                              {new Date(event.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPinIcon className="size-3.5 shrink-0" />
                            <span className="line-clamp-1">
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="px-4 pb-4 flex items-center gap-2">
                        <Button
                          asChild
                          variant="default"
                          size="sm"
                          className="flex-1"
                        >
                          <Link
                            href={`/dashboard/events/${event._id}/participants`}
                          >
                            <UsersIcon className="size-4 mr-1.5" />
                            Participants
                          </Link>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-9"
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/events/${event.slug}`}>
                                <ExternalLink className="size-4 mr-2" />
                                View Event
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/events/edit/${event._id}`}
                              >
                                <EditIcon className="size-4 mr-2" />
                                Edit Event
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(event._id)}
                              disabled={deleteMutation.isPending}
                            >
                              <TrashIcon className="size-4 mr-2" />
                              Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </BlurFade>
                );
              })}
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-center pt-8">
                <Pagination
                  currentPage={data.currentPage}
                  totalPages={data.totalPages}
                  hasNextPage={data.currentPage < data.totalPages}
                  hasPrevPage={data.currentPage > 1}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
