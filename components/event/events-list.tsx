"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, SearchX } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { queryKeys } from "@/hooks/api/query-keys";
import type { ApiResponse, PaginatedEventResponse } from "@/types/api-types";
import EventCard from "@/components/event/event-card";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";

interface EventsListProps {
  page: number;
  search: string;
  mode: string;
  selectedTags: string[];
}

export function EventsList({
  page,
  search,
  mode,
  selectedTags,
}: EventsListProps) {
  const params = {
    page,
    search,
    mode: mode !== "all" ? mode : undefined,
    tags: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
  };

  const { data } = useSuspenseQuery({
    queryKey: queryKeys.events.list(params),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedEventResponse>>(
        "/event",
        { params },
      );
      return data.data;
    },
  });

  const { events, totalEvents, totalPages, currentPage, nextPage, prevPage } =
    data;

  const hasNextPage = !!nextPage;
  const hasPrevPage = !!prevPage;
  const hasFilters = mode !== "all" || selectedTags.length > 0;

  // Empty State Component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4 rounded-xl border border-dashed border-border">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-6">
        {search ? (
          <SearchX className="size-7 text-muted-foreground" />
        ) : (
          <Calendar className="size-7 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {search ? "No matching events" : "No events found"}
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        {search
          ? `We couldn't find any events matching "${search}". Try adjusting your search or filters.`
          : hasFilters
            ? "No events match your current filters. Try adjusting them or clear all filters."
            : "There are no events to show right now. Be the first to create one!"}
      </p>
      <div className="flex gap-3">
        {(search || hasFilters) && (
          <Link href="/events">
            <Button variant="outline">Clear Filters</Button>
          </Link>
        )}
        <Link href="/auth/signup?role=organizer">
          <Button>Create an Event</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Results Count */}
      {totalEvents > 0 && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {search ? (
              <>
                {totalEvents} result{totalEvents !== 1 ? "s" : ""} for{" "}
                <span className="font-medium text-foreground">"{search}"</span>
              </>
            ) : (
              <>
                Showing{" "}
                <span className="font-medium text-foreground">
                  {events.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {totalEvents}
                </span>{" "}
                events
              </>
            )}
          </p>
        </div>
      )}

      {events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <BlurFade key={event.slug} delay={0.03 + index * 0.03} inView>
                <EventCard event={event} />
              </BlurFade>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </>
  );
}
