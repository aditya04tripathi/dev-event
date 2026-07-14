"use client";

import { Zap, Target, Users, Globe, Shield, Calendar } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Registration",
    description:
      "Book your spot in seconds. No complicated forms, no friction—just a seamless experience.",
  },
  {
    icon: Target,
    title: "Curated Events",
    description:
      "Only quality events from verified organizers. We filter out the noise so you can focus on learning.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Connect with developers who share your interests and goals. Build lasting professional relationships.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Discover events from around the world. Attend in-person or join virtually from anywhere.",
  },
  {
    icon: Shield,
    title: "Trusted Platform",
    description:
      "Secure bookings, verified organizers, and reliable event information you can count on.",
  },
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description:
      "Add events to your calendar with one click. Never miss an event that matters to you.",
  },
];

export function ValuePropSection() {
  return (
    <section className="section bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <BlurFade delay={0.1} inView>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-headline mb-4">
              Why developers choose{" "}
              <span className="text-primary">DevEvent</span>
            </h2>
            <p className="text-body-lg text-muted-foreground">
              Everything you need to discover, attend, and organize developer
              events—all in one place.
            </p>
          </div>
        </BlurFade>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map((feature, index) => (
            <BlurFade key={feature.title} delay={0.15 + index * 0.05} inView>
              <div
                className={cn(
                  "group relative p-6 rounded-xl border border-border bg-card",
                  "transition-all duration-200 hover:shadow-md hover:border-border/80",
                  "hover:-translate-y-0.5",
                )}
              >
                {/* Icon */}
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="size-6" />
                </div>
                {/* Title */}
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
