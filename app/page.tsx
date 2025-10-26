import { Suspense } from "react";
import ExploreButton from "@/components/explore-btn";
import { FeaturedEvents } from "@/components/featured-events";
import { FeaturedEventsSkeleton } from "@/components/featured-events-skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevEvent - The Hub for Every Dev Event You Can't Miss",
  description:
    "Discover hackathons, meetups, and conferences all in one place. Join amazing tech events and connect with the developer community.",
  keywords: [
    "developer events",
    "hackathons",
    "tech meetups",
    "conferences",
    "coding events",
    "tech community",
  ],
  openGraph: {
    title: "DevEvent - The Hub for Every Dev Event You Can't Miss",
    description:
      "Discover hackathons, meetups, and conferences all in one place.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevEvent - The Hub for Every Dev Event You Can't Miss",
      },
    ],
  },
};

const HomePage = () => {
  return (
    <section className="container mx-auto w-full px-4">
      <div className="min-h-[400px] sm:min-h-[500px] md:h-[600px] flex gap-3 sm:gap-4 flex-col justify-center items-center py-12 sm:py-16 md:py-0">
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
          The Hub for Every Dev <br /> Event You Can't Miss
        </h1>

        <p className="text-center mt-3 sm:mt-4 md:mt-5 text-base sm:text-lg px-4">
          Hackathons, Meetups, and Conferences, All in One Place
        </p>

        <ExploreButton />
      </div>

      <div
        id="events"
        className="mt-12 sm:mt-16 md:mt-20 space-y-5 sm:space-y-6 md:space-y-7"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl">Featured Events</h2>

        <Suspense fallback={<FeaturedEventsSkeleton />}>
          <FeaturedEvents />
        </Suspense>
      </div>
    </section>
  );
};

export default HomePage;
