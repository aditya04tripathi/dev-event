"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <GridPattern
        width={40}
        height={40}
        className={cn(
          "absolute inset-0 -z-10 opacity-50",
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
        )}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/50 to-background" />

      <div className="container-wide section-lg">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Eyebrow Badge */}
          <BlurFade delay={0.1} inView>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8">
              <Sparkles className="size-4" />
              <span>The Developer Event Platform</span>
            </div>
          </BlurFade>

          {/* Headline */}
          <BlurFade delay={0.2} inView>
            <h1 className="text-display mb-6">
              Discover events that <span className="text-primary">inspire</span>{" "}
              and <span className="text-muted-foreground">connect</span>
            </h1>
          </BlurFade>

          {/* Description */}
          <BlurFade delay={0.3} inView>
            <p className="text-body-lg text-muted-foreground max-w-2xl mb-10">
              Find hackathons, meetups, and conferences that match your
              interests. Connect with developers building the future, learn new
              skills, and grow your network.
            </p>
          </BlurFade>

          {/* CTAs */}
          <BlurFade delay={0.4} inView>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/events">
                <Button size="lg" className="min-w-[180px]">
                  Browse Events
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/auth/signup?role=organizer">
                <Button variant="outline" size="lg" className="min-w-[180px]">
                  Host an Event
                </Button>
              </Link>
            </div>
          </BlurFade>

          {/* Social Proof */}
          <BlurFade delay={0.5} inView>
            <div className="mt-16 flex flex-col sm:flex-row items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="size-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span>Join 10,000+ developers</span>
              </div>
              <div className="hidden sm:block w-px h-5 bg-border" />
              <span>500+ events hosted</span>
              <div className="hidden sm:block w-px h-5 bg-border" />
              <span>100% free to join</span>
            </div>
          </BlurFade>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
