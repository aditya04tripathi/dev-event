import EventCard from "@/components/event-card";
import ExploreButton from "@/components/explore-btn";
import { Card, CardContent } from "@/components/ui/card";
import { IEvent } from "@/database/event.model";
import { getEvents } from "@/lib/actions/event.action";

const HomePage = async () => {
  const { events } = await getEvents();

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

        {events && events.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {events.map((event: IEvent) => (
              <li key={event.title}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        ) : (
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm sm:text-base">
                  No events found
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default HomePage;
