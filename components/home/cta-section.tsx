"use client";

import { ArrowRight, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

      <div className="container-wide section relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <BlurFade delay={0.1} inView>
            <div className="max-w-xl">
              <h2 className="text-headline mb-4">
                Ready to host your own{" "}
                <span className="text-primary">developer event</span>?
              </h2>
              <p className="text-body-lg text-muted-foreground mb-8">
                Create and manage events for your developer community. Reach
                thousands of developers, handle registrations effortlessly, and
                build your brand.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup?role=organizer">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </BlurFade>

          {/* Feature Cards */}
          <BlurFade delay={0.2} inView>
            <div className="grid gap-4">
              <div
                className={cn(
                  "flex items-start gap-4 p-5 rounded-xl border border-border bg-card",
                  "transition-all hover:shadow-sm hover:border-border/80",
                )}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Easy Event Creation</h3>
                  <p className="text-sm text-muted-foreground">
                    Create beautiful event pages in minutes. Add details, set
                    capacity, and publish.
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "flex items-start gap-4 p-5 rounded-xl border border-border bg-card",
                  "transition-all hover:shadow-sm hover:border-border/80",
                )}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Attendee Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Track registrations, check-in attendees with QR codes, and
                    export participant data.
                  </p>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
