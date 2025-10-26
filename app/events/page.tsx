import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getAllTags } from "@/lib/actions/event.action";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import SearchBar from "@/components/search-bar";
import EventFilters from "@/components/event-filters";
import { EventsList } from "@/components/events-list";
import { EventsListSkeleton } from "@/components/events-list-skeleton";

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

      <Suspense
        key={`${page}-${search}-${mode}-${tagsParam}`}
        fallback={<EventsListSkeleton />}
      >
        <EventsList
          page={page}
          search={search}
          mode={mode}
          selectedTags={selectedTags}
        />
      </Suspense>
    </div>
  );
}
