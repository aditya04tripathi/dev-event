"use client";

import { useUserInfo } from "@/hooks/api/use-users";
import { useEventContext } from "@/context/event-context";
import { useParams, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/event/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { GridPattern } from "@/components/ui/grid-pattern";
import Pagination from "@/components/shared/pagination";
import {
  CalendarIcon,
  MailIcon,
  ArrowLeftIcon,
  UserIcon,
  CalendarDaysIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function getUserInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function OrganizerPublicPage() {
  const { id } = useParams() as { id: string };
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const { useEvents } = useEventContext();
  const { data: user, isLoading: userLoading } = useUserInfo(id);
  const { data: eventsData, isLoading: eventsLoading } = useEvents({
    organizerId: id,
    page,
    limit: 9,
  });

  if (userLoading) {
    return (
      <main className="section-sm">
        <div className="container-wide">
          <Skeleton className="h-5 w-32 mb-8" />
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <Skeleton className="size-28 rounded-full" />
              <div className="space-y-4 flex-1 text-center md:text-left">
                <Skeleton className="h-10 w-64 mx-auto md:mx-0" />
                <Skeleton className="h-5 w-48 mx-auto md:mx-0" />
                <div className="flex gap-4 justify-center md:justify-start">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-[360px] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user || !user.roles.includes("organizer")) {
    return (
      <main className="section-sm">
        <div className="container-wide">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <UserIcon className="size-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Organizer Not Found</h1>
            <p className="text-muted-foreground mb-6 max-w-md">
              The person you are looking for might not be an organizer or the
              account doesn't exist.
            </p>
            <Link href="/organizers">
              <Button variant="outline">
                <ArrowLeftIcon className="size-4 mr-2" />
                Back to Organizers
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative section-sm">
      <GridPattern
        width={40}
        height={40}
        className={cn(
          "absolute inset-0 opacity-15 mask-[radial-gradient(600px_circle_at_center,white,transparent)]",
        )}
      />

      <div className="relative container-wide">
        <BlurFade delay={0.05}>
          <Link
            href="/organizers"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 group"
          >
            <ArrowLeftIcon className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Organizers
          </Link>
        </BlurFade>

        {/* Organizer Header */}
        <BlurFade delay={0.1}>
          <section className="rounded-2xl border border-border bg-card p-8 mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              <Avatar className="size-28 ring-4 ring-primary/10">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {getUserInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                    {user.fullName}
                  </h1>
                  <Badge className="bg-primary/10 text-primary border-0">
                    Organizer
                  </Badge>
                </div>

                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                  <MailIcon className="size-4" />
                  {user.email}
                </p>

                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground justify-center md:justify-start">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="size-4" />
                    Joined{" "}
                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDaysIcon className="size-4" />
                    {eventsData?.totalEvents || 0} Events
                  </span>
                </div>
              </div>
            </div>
          </section>
        </BlurFade>

        {/* Events Section */}
        <BlurFade delay={0.15}>
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">
                Events by {user.fullName.split(" ")[0]}
              </h2>
            </div>

            {eventsLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <Skeleton key={n} className="h-[360px] rounded-xl" />
                ))}
              </div>
            ) : eventsData?.events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl bg-muted/30">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <CalendarDaysIcon className="size-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  This organizer hasn't published any events yet.
                </p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventsData?.events.map((event, index) => (
                    <BlurFade key={event._id} delay={0.2 + index * 0.05}>
                      <EventCard event={event} />
                    </BlurFade>
                  ))}
                </div>

                {/* Pagination */}
                {eventsData && eventsData.totalPages > 1 && (
                  <div className="flex justify-center pt-4">
                    <Pagination
                      currentPage={eventsData.currentPage}
                      totalPages={eventsData.totalPages}
                      hasNextPage={
                        eventsData.currentPage < eventsData.totalPages
                      }
                      hasPrevPage={eventsData.currentPage > 1}
                    />
                  </div>
                )}
              </>
            )}
          </section>
        </BlurFade>
      </div>
    </main>
  );
}
