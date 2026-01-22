"use client";

import { useOrganizers } from "@/hooks/use-organizers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BlurFade } from "@/components/ui/blur-fade";
import { GridPattern } from "@/components/ui/grid-pattern";
import {
  ArrowRightIcon,
  AlertCircleIcon,
  UsersIcon,
  CalendarIcon,
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

function OrganizerCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="size-14 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  );
}

export default function OrganizersPage() {
  const { data: organizers, isLoading, error } = useOrganizers();

  if (isLoading) {
    return (
      <main className="section-sm">
        <div className="container-wide">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-full max-w-md mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <OrganizerCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="section-sm">
        <div className="container-wide">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
              <AlertCircleIcon className="size-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6 max-w-md">
              We couldn't load the organizers. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
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
          "absolute inset-0 opacity-15 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
        )}
      />

      <div className="relative container-wide">
        {/* Header */}
        <BlurFade delay={0.05}>
          <header className="mb-12 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <UsersIcon className="size-4" />
              Community
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Meet Our Organizers
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover the talented individuals and teams behind the amazing
              tech events in our community.
            </p>
          </header>
        </BlurFade>

        {/* Grid */}
        {organizers && organizers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizers.map((organizer: any, index: number) => (
              <BlurFade key={organizer._id} delay={0.1 + index * 0.05}>
                <div className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="size-14 ring-2 ring-border group-hover:ring-primary/30 transition-all">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${organizer.username}`}
                      />
                      <AvatarFallback className="text-lg bg-primary/10 text-primary">
                        {getUserInitials(organizer.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {organizer.fullName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        @{organizer.username}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="size-4" />
                      <span>Event Organizer</span>
                    </div>
                  </div>

                  <Link href={`/organizers/${organizer._id}`}>
                    <Button variant="outline" className="w-full group/btn">
                      View Profile
                      <ArrowRightIcon className="ml-2 size-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </BlurFade>
            ))}
          </div>
        ) : (
          <BlurFade delay={0.1}>
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-xl bg-muted/30">
              <div className="rounded-full bg-muted p-4 mb-4">
                <UsersIcon className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Organizers Yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Check back later to discover event organizers in our community.
              </p>
            </div>
          </BlurFade>
        )}
      </div>
    </main>
  );
}
