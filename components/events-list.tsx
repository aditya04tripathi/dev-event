import EventCard from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Pagination from "@/components/pagination";
import { getEvents } from "@/lib/actions/event.action";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

interface EventsListProps {
  page: number;
  search: string;
  mode: string;
  selectedTags: string[];
}

export async function EventsList({
  page,
  search,
  mode,
  selectedTags,
}: EventsListProps) {
  const {
    events,
    totalEvents,
    totalPages,
    currentPage,
    hasNextPage,
    hasPrevPage,
  } = await getEvents({
    page,
    search,
    mode: mode !== "all" ? mode : undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  });

  return (
    <>
      {search && (
        <div className="mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Found {totalEvents} event{totalEvents !== 1 ? "s" : ""} for &quot;
            {search}&quot;
          </p>
        </div>
      )}

      {events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {events.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 sm:mt-10 md:mt-12">
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
        <Card>
          <CardContent className="py-12 sm:py-16">
            <div className="text-center space-y-3 sm:space-y-4 px-4">
              <p className="text-muted-foreground text-sm sm:text-base">
                {search
                  ? `No events found matching "${search}"`
                  : "No events found"}
              </p>
              {!search && (
                <Link href="/events/new" className="inline-block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="sm:size-default"
                  >
                    <PlusIcon className="size-4 mr-2" />
                    Create Your First Event
                  </Button>
                </Link>
              )}
              {search && (
                <Link href="/events" className="inline-block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="sm:size-default"
                  >
                    Clear Search
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
