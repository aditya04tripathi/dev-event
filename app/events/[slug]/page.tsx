import {
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BookEvent from "@/components/book-event";
import { SimilarEvents } from "@/components/similar-events";
import { SimilarEventsSkeleton } from "@/components/similar-events-skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBookingByEventSlug } from "@/lib/actions/booking.action";
import { getEventBySlug } from "@/lib/actions/event.action";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found | DevEvent",
      description: "The requested event could not be found.",
    };
  }

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
}

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <Badge key={tag} variant="secondary" className="px-3 py-1">
        {tag}
      </Badge>
    ))}
  </div>
);

const EventAgenda = ({ agenda }: { agenda: string[] }) => (
  <div className="flex flex-col items-start gap-2">
    <h2 className="text-2xl sm:text-3xl md:text-4xl">Agenda</h2>
    <ul className="space-y-2 w-full">
      {agenda.map((item, index) => (
        <li key={item} className="flex gap-3 text-sm sm:text-base">
          <span className="text-muted-foreground shrink-0">{index + 1}.</span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const EventDetailsPage = async ({ params }: RouteParams) => {
  const { slug } = await params;

  const event = await getEventBySlug(slug);
  const booking = (await getBookingByEventSlug(slug)) ?? 0;

  if (!event) {
    return notFound();
  }

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
    organizer,
  } = event;

  const eventId =
    typeof event._id === "string"
      ? event._id
      : (event._id as { toString(): string }).toString();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
      <div className="mb-6 sm:mb-8 space-y-2">
        <h1 className="font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          <Image
            src={image}
            alt={title}
            width={800}
            height={450}
            className="w-full h-auto object-cover rounded"
          />

          <div className="flex flex-col items-start gap-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl">Overview</h2>
            <p className="text-sm sm:text-base leading-relaxed">{overview}</p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl">Event Details</h2>
            <div className="flex flex-col items-start gap-2 w-full">
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <CalendarIcon className="size-4 text-muted-foreground shrink-0" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <ClockIcon className="size-4 text-muted-foreground shrink-0" />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <MapPinIcon className="size-4 text-muted-foreground shrink-0" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <UsersIcon className="size-4 text-muted-foreground shrink-0" />
                <span>{audience}</span>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <GlobeIcon className="size-4 text-muted-foreground shrink-0" />
                <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
              </div>
            </div>
          </div>

          <EventAgenda agenda={agenda} />

          <div className="flex flex-col items-start gap-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl">
              About the Organizer
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">{organizer}</p>
          </div>

          <div>
            <EventTags tags={tags} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-22">
            <CardHeader>
              <CardTitle>
                <h3 className="text-xl sm:text-2xl">Book Your Spot</h3>
              </CardTitle>
              <CardDescription className="text-sm">
                {booking > 0
                  ? `Join ${booking} people(s) who have already booked their spot(s).`
                  : "Be the first to book your spot."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookEvent eventId={eventId} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12 sm:mt-14 md:mt-16 space-y-5 sm:space-y-6">
        <Separator />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 sm:mb-6">
            Similar Events
          </h2>

          <Suspense fallback={<SimilarEventsSkeleton />}>
            <SimilarEvents slug={slug} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
