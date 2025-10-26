import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  image: string;
  location: string;
  slug: string;
  date: string;
  time: string;
}

const EventCard = ({ title, image, location, slug, date, time }: Props) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image
        className="poster"
        src={image}
        alt={title}
        width={410}
        height={300}
      />

      <div className="flex flex-row gap-2">
        <Image src="/icons/pin.svg" alt="location" height={14} width={14} />
        <p className="info">{location}</p>
      </div>

      <p className="title">{title}</p>

      <div className="datetime">
        <div>
          <Image src="/icons/calendar.svg" alt="date" height={14} width={14} />
          <p className="info">{date}</p>
        </div>
        <div>
          <Image src="/icons/clock.svg" alt="time" height={14} width={14} />
          <p className="info">{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
