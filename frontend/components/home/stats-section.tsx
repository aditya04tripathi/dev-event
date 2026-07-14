"use client";

import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";

const STATS = [
  {
    value: 500,
    suffix: "+",
    label: "Events Hosted",
    description: "Developer events worldwide",
  },
  {
    value: 10,
    suffix: "k+",
    label: "Developers",
    description: "Active community members",
  },
  { value: 50, suffix: "+", label: "Cities", description: "Global presence" },
  {
    value: 100,
    suffix: "%",
    label: "Free",
    description: "Always free to join",
  },
];

export function StatsSection() {
  return (
    <section className="relative border-y border-border bg-surface/50">
      <div className="container-wide py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((stat, index) => (
            <BlurFade key={stat.label} delay={0.1 + index * 0.1} inView>
              <div className="relative text-center lg:text-left">
                {/* Large number */}
                <div className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  <NumberTicker value={stat.value} delay={0.2 + index * 0.1} />
                  <span className="text-primary">{stat.suffix}</span>
                </div>
                {/* Label */}
                <div className="mt-2 text-base font-medium text-foreground">
                  {stat.label}
                </div>
                {/* Description */}
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.description}
                </div>
                {/* Decorative line on large screens */}
                {index < STATS.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-border" />
                )}
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
