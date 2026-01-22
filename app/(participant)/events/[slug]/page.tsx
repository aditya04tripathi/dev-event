import type { Metadata } from "next";
import { Suspense } from "react";
import { api } from "@/lib/axios";
import type { ApiResponse, EventResponse } from "@/types/api-types";
import { EventDetailsContent } from "@/components/event/event-details-content";
import { SimilarEvents } from "@/components/event/similar-events";
import { SimilarEventsSkeleton } from "@/components/event/similar-events-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { BlurFade } from "@/components/ui/blur-fade";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { data } = await api.get<ApiResponse<EventResponse>>(
      `/event/${slug}`,
    );
    const event = data.data;

    return {
      title: `${event.title} | DevEvent`,
      description: event.description,
      keywords: [
        ...event.tags,
        "tech event",
        "developer event",
        event.mode,
        event.location,
      ],
      openGraph: {
        title: event.title,
        description: event.description,
        images: [
          {
            url: event.image,
            width: 1200,
            height: 630,
            alt: event.title,
          },
        ],
        type: "website",
      },
    };
  } catch {
    return {
      title: "Event Not Found | DevEvent",
      description: "The requested event could not be found.",
    };
  }
}

function EventDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Back link */}
      <Skeleton className="h-5 w-32" />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-12 w-3/4" />
        <div className="flex gap-6">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div>
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

const EventDetailsPage = async ({ params }: RouteParams) => {
  const { slug } = await params;

  return (
    <div className="section-sm">
      <div className="container-wide">
        <Suspense fallback={<EventDetailSkeleton />}>
          <EventDetailsContent slug={slug} />
        </Suspense>

        {/* Similar Events Section */}
        <div className="mt-16 pt-12 border-t border-border">
          <BlurFade delay={0.3} inView>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Similar Events
                </h2>
                <p className="text-muted-foreground mt-1">
                  Discover more events you might enjoy
                </p>
              </div>
            </div>
          </BlurFade>
          <Suspense fallback={<SimilarEventsSkeleton />}>
            <SimilarEvents slug={slug} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
