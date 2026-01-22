import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturedEvents } from "@/components/event/featured-events";
import { FeaturedEventsSkeleton } from "@/components/event/featured-events-skeleton";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { ValuePropSection } from "@/components/home/value-prop-section";
import { CTASection } from "@/components/home/cta-section";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";

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
    <>
      <HeroSection />
      <StatsSection />

      {/* Featured Events Section */}
      <section className="section border-t border-border">
        <div className="container-wide">
          <BlurFade delay={0.1} inView>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
                  Featured Events
                </h2>
                <p className="text-muted-foreground">
                  Curated events from communities around the globe
                </p>
              </div>
              <Link href="/events" className="hidden md:block">
                <Button variant="outline">
                  View all events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </BlurFade>

          <Suspense fallback={<FeaturedEventsSkeleton />}>
            <FeaturedEvents />
          </Suspense>

          <div className="md:hidden mt-8">
            <Link href="/events">
              <Button variant="outline" className="w-full">
                View all events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ValuePropSection />
      <CTASection />
    </>
  );
};

export default HomePage;
