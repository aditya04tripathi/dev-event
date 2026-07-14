"use client";

import { useOrganizerStats } from "@/hooks/use-analytics";
import {
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
  TrendingUp,
} from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardHeader() {
  return null;
}

const STAT_ITEMS = [
  {
    key: "totalEvents",
    label: "Total Events",
    description: "Events you've created",
    icon: CalendarIcon,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    key: "totalBookings",
    label: "Total Bookings",
    description: "Registrations received",
    icon: UsersIcon,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    key: "totalCheckIns",
    label: "Check-ins",
    description: "Attendees checked in",
    icon: CheckCircleIcon,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
] as const;

export function DashboardStats() {
  const { data: stats, isLoading } = useOrganizerStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-10 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3 mb-8">
      {STAT_ITEMS.map((item) => (
        <div
          key={item.key}
          className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">
              {item.label}
            </p>
            <div className={`p-2.5 rounded-lg ${item.bgColor}`}>
              <item.icon className={`size-5 ${item.color}`} />
            </div>
          </div>
          <p className="text-3xl font-semibold tracking-tight mb-1">
            <NumberTicker value={stats[item.key]} delay={0.1} />
          </p>
          <p className="text-xs text-muted-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
