"use client";

import { Calendar, MapPin, Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { EventResponse } from "@/types/api-types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  event: EventResponse;
  variant?: "default" | "compact" | "featured";
}

const EventCard = ({ event, variant = "default" }: Props) => {
  const getModeColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "online":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "offline":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "hybrid":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      default:
        return "";
    }
  };

  if (variant === "compact") {
    return (
      <Link href={`/events/${event.slug}`} className="group block">
        <article className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-sm hover:border-border/80 transition-all">
          {/* Thumbnail */}
          <div className="relative size-20 shrink-0 rounded-lg overflow-hidden bg-muted">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/events/${event.slug}`} className="group block h-full">
      <article
        className={cn(
          "h-full overflow-hidden rounded-xl border border-border bg-card",
          "transition-all duration-200 hover:shadow-md hover:border-border/80",
          "hover:-translate-y-0.5",
        )}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Mode Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="outline"
              className={cn(
                "backdrop-blur-sm bg-background/90 capitalize text-xs font-medium",
                getModeColor(event.mode),
              )}
            >
              {event.mode}
            </Badge>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Date & Time */}
          <div className="flex items-center gap-3 text-sm mb-3">
            <div className="flex items-center gap-1.5 text-primary font-medium">
              <Calendar className="size-4" />
              <span>{event.date}</span>
            </div>
            {event.time && (
              <>
                <span className="text-muted-foreground">·</span>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>{event.time}</span>
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border">
              {event.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="muted"
                  size="sm"
                  className="font-normal"
                >
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{event.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default EventCard;
