"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  Globe,
  Video,
  Building2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/axios";
import { queryKeys } from "@/hooks/api/query-keys";
import type { ApiResponse, EventResponse } from "@/types/api-types";
import BookEvent from "@/components/event/book-event";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import { BlurFade } from "@/components/ui/blur-fade";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function getModeIcon(mode: string) {
  switch (mode.toLowerCase()) {
    case "online":
      return Video;
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
    case "in-person":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    default:
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
  }
}

export function EventDetailsContent({ slug }: { slug: string }) {
  const { data: event } = useSuspenseQuery({
    queryKey: queryKeys.events.detail(slug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<EventResponse>>(
        `/event/${slug}`,
      );
      return data.data;
    },
  });

  const {
    title,
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizerId,
  } = event;

  const organizerName =
    typeof organizerId === "object" ? organizerId.fullName : "Organizer";
  const organizerLink = `/organizers/${typeof organizerId === "string" ? organizerId : organizerId._id}`;

  const ModeIcon = getModeIcon(mode);

  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text: overview,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-8">
      {/* Back link */}
      <BlurFade delay={0.05} inView>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to events
        </Link>
      </BlurFade>

      {/* Header */}
      <header className="space-y-5">
        <BlurFade delay={0.1} inView>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("gap-1.5", getModeColor(mode))}>
              <ModeIcon className="size-3" />
              {mode}
            </Badge>
            {tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={0.15} inView>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
            {title}
          </h1>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
              <Calendar className="size-4 text-primary" />
              <span className="font-medium">{date}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
              <Clock className="size-4 text-primary" />
              <span className="font-medium">{time}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
              <MapPin className="size-4 text-primary" />
              <span className="font-medium">{location}</span>
            </div>
          </div>
        </BlurFade>
      </header>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Image */}
          <BlurFade delay={0.25} inView>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted shadow-lg">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                priority
              />
              {/* Share button */}
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-4 right-4 size-10 rounded-full shadow-lg"
                onClick={handleShare}
              >
                <Share2 className="size-4" />
                <span className="sr-only">Share event</span>
              </Button>
            </div>
          </BlurFade>

          {/* Overview */}
          <BlurFade delay={0.3} inView>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">About this event</h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed text-base">
                  {overview}
                </p>
                {description && (
                  <div className="text-muted-foreground leading-relaxed mt-4">
                    {description}
                  </div>
                )}
              </div>
            </section>
          </BlurFade>

          {/* Agenda */}
          {agenda && agenda.length > 0 && (
            <BlurFade delay={0.35} inView>
              <section className="space-y-5">
                <h2 className="text-xl font-semibold">Event Agenda</h2>
                <div className="space-y-3">
                  {agenda.map((item, index) => (
                    <div
                      key={index}
                      className="group flex gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex-none flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed flex-1 pt-1">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </BlurFade>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Registration card */}
            <BlurFade delay={0.4} inView>
              <div className="relative rounded-xl bg-card border shadow-lg overflow-hidden">
                <ShineBorder
                  shineColor={["hsl(var(--primary))", "hsl(var(--muted))"]}
                  borderWidth={2}
                  duration={10}
                />
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Register Now</h3>
                    <p className="text-sm text-muted-foreground">
                      Secure your spot for this event
                    </p>
                  </div>

                  <BookEvent eventId={event._id} />
                </div>
              </div>
            </BlurFade>

            {/* Organizer card */}
            <BlurFade delay={0.5} inView>
              <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold mb-4">Hosted by</h3>
                <Link
                  href={organizerLink}
                  className="flex items-center gap-3 p-3 -m-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="size-12 border">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {organizerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{organizerName}</p>
                    <p className="text-sm text-muted-foreground">
                      Event Organizer
                    </p>
                  </div>
                  <ArrowLeft className="size-4 text-muted-foreground rotate-180" />
                </Link>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </div>
  );
}
