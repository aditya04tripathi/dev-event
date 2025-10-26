import EventCard from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getEvents, getAllTags } from "@/lib/actions/event.action";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import SearchBar from "@/components/search-bar";
import Pagination from "@/components/pagination";
import EventFilters from "@/components/event-filters";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    mode?: string;
    tags?: string;
  }>;
}

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const mode = params.mode || "all";
  const tagsParam = params.tags || "all";
  const selectedTags = tagsParam !== "all" ? tagsParam.split(",") : [];

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

  const allTags = await getAllTags();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            All Events
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-1 sm:mt-2">
            Discover and join amazing tech events
          </p>
        </div>
        <Link href="/events/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <PlusIcon className="size-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
        <SearchBar initialSearch={search} />
        <EventFilters
          allTags={allTags}
          initialMode={mode}
          initialTags={tagsParam}
        />
      </div>

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
    </div>
  );
}
