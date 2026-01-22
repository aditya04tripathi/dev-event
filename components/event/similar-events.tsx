"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarX } from "lucide-react";
import { api } from "@/lib/axios";
import type {
  ApiResponse,
  EventResponse,
  PaginatedEventResponse,
} from "@/types/api-types";
import EventCard from "@/components/event/event-card";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SimilarEventsProps {
  slug: string;
}

export function SimilarEvents({ slug }: SimilarEventsProps) {
  const { data: similarEvents } = useSuspenseQuery({
    queryKey: ["events", "similar", slug],
    queryFn: async () => {
      // First get the event to get its tags
      const { data: eventRes } = await api.get<ApiResponse<EventResponse>>(
        `/event/${slug}`,
      );
      if (!eventRes.data) return [];

      const { data: listRes } = await api.get<
        ApiResponse<PaginatedEventResponse>
      >("/event", { params: { tags: eventRes.data.tags.join(","), limit: 7 } });

      return listRes.data.events.filter((e) => e.slug !== slug).slice(0, 6);
    },
  });

  if (similarEvents.length === 0) {
    return (
      <BlurFade delay={0.35} inView>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <CalendarX className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No similar events found</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            We couldn&apos;t find events with similar topics. Check out all our
            events instead.
          </p>
          <Button asChild variant="outline">
            <Link href="/events">Browse All Events</Link>
          </Button>
        </div>
      </BlurFade>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {similarEvents.map((event, index) => (
        <BlurFade key={event.slug} delay={0.35 + index * 0.05} inView>
          <EventCard event={event} variant="compact" />
        </BlurFade>
      ))}
    </div>
  );
}
