import type { Metadata } from "next";
import NewEventForm from "@/components/forms/new-event-form";
import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Create New Event | DevEvent",
  description:
    "Share your tech event with the community. Create a new event on DevEvent and reach thousands of developers.",
  keywords: [
    "create event",
    "host event",
    "tech community",
    "developer events",
  ],
};

export default function NewEventPage() {
  return (
    <main className="section-sm">
      <div className="container-tight">
        <BlurFade delay={0.05}>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 group"
          >
            <ArrowLeftIcon className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>

          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Create New Event
            </h1>
            <p className="text-muted-foreground mt-1">
              Fill in the details below to publish your event
            </p>
          </header>
        </BlurFade>

        <NewEventForm />
      </div>
    </main>
  );
}
