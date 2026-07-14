import type { Metadata } from "next";
import { Suspense } from "react";
import EventFilters from "@/components/event/event-filters";
import { EventsList } from "@/components/event/events-list";
import { EventsListSkeleton } from "@/components/event/events-list-skeleton";
import SearchBar from "@/components/shared/search-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { BlurFade } from "@/components/ui/blur-fade";
import { CalendarDaysIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Browse Events | DevEvent",
  description:
    "Discover and join amazing tech events. Browse through hackathons, meetups, and conferences. Filter by mode, tags, and search to find your perfect event.",
  keywords: [
    "browse events",
    "tech events",
    "developer conferences",
    "hackathons list",
    "coding meetups",
  ],
  openGraph: {
    title: "Browse Events | DevEvent",
    description: "Discover and join amazing tech events.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Browse Events | DevEvent",
      },
    ],
  },
};

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
  const page = parseInt(params.page || "1", 10);
  const search = params.search || "";
  const mode = params.mode || "all";
  const tagsParam = params.tags || "all";
  const selectedTags = tagsParam !== "all" ? tagsParam.split(",") : [];

  return (
    <main className="section-sm">
      <div className="container-wide">
        {/* Header */}
        <BlurFade delay={0.05}>
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <CalendarDaysIcon className="size-4" />
              Events
            </div>
            <h1 className="text-headline mb-2">Explore Events</h1>
            <p className="text-body-lg text-muted-foreground">
              Discover hackathons, meetups, and conferences for developers
            </p>
          </div>
        </BlurFade>

        {/* Search and Filters */}
        <BlurFade delay={0.1}>
          <div className="flex flex-col gap-4 mb-8 pb-8 border-b border-border">
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBar initialSearch={search} className="sm:max-w-sm" />
              <Suspense
                fallback={
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-[150px]" />
                    <Skeleton className="h-10 w-[170px]" />
                  </div>
                }
              >
                <EventFilters initialMode={mode} initialTags={tagsParam} />
              </Suspense>
            </div>
          </div>
        </BlurFade>

        {/* Events Grid */}
        <BlurFade delay={0.15}>
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
        </BlurFade>
      </div>
    </main>
  );
}
