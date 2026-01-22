"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { queryKeys } from "@/hooks/api/query-keys";
import type { ApiResponse, PaginatedEventResponse } from "@/types/api-types";
import EventCard from "@/components/event/event-card";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";

export function FeaturedEvents() {
  const { data } = useSuspenseQuery({
    queryKey: queryKeys.events.list({ limit: 6 }),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedEventResponse>>(
        "/event",
        { params: { limit: 6 } },
      );
      return data.data;
    },
  });

  if (!data?.events || data.events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-dashed border-border">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted mb-4">
          <Calendar className="size-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No events yet</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
          Be the first to create an event and connect with the developer
          community.
        </p>
        <Link href="/auth/signup?role=organizer">
          <Button>Create an Event</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.events.map((event, index) => (
        <BlurFade key={event._id} delay={0.05 + index * 0.05} inView>
          <EventCard event={event} />
        </BlurFade>
      ))}
    </div>
  );
}
