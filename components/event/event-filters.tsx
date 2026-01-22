"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Filter, Monitor, MapPin, Layers, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";
import type { ApiResponse, PaginatedEventResponse } from "@/types/api-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventFiltersProps {
  initialMode?: string;
  initialTags?: string;
}

const MODE_OPTIONS = [
  { value: "all", label: "All Modes", icon: Layers },
  { value: "offline", label: "In Person", icon: MapPin },
  { value: "online", label: "Online", icon: Monitor },
  { value: "hybrid", label: "Hybrid", icon: Layers },
];

export default function EventFilters({
  initialMode = "all",
  initialTags = "all",
}: EventFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: allTags } = useSuspenseQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedEventResponse>>(
        "/event",
        { params: { limit: 100 } },
      );
      const tags = new Set<string>();
      data.data.events.forEach((event) => {
        event.tags.forEach((tag) => tags.add(tag));
      });
      return Array.from(tags).sort();
    },
  });

  const hasActiveFilters = initialMode !== "all" || initialTags !== "all";

  const handleModeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("mode");
    } else {
      params.set("mode", value);
    }
    params.set("page", "1");
    router.push(`/events?${params.toString()}`);
  };

  const handleTagChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("tags");
    } else {
      params.set("tags", value);
    }
    params.set("page", "1");
    router.push(`/events?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("mode");
    params.delete("tags");
    params.set("page", "1");
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Mode Filter */}
      <Select value={initialMode} onValueChange={handleModeChange}>
        <SelectTrigger className="w-[150px] h-10">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Mode" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {MODE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <option.icon className="size-4" />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <Select value={initialTags} onValueChange={handleTagChange}>
          <SelectTrigger className="w-[170px] h-10">
            <SelectValue placeholder="Select tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          {initialMode !== "all" && (
            <Badge variant="secondary" className="gap-1 pr-1.5">
              {MODE_OPTIONS.find((o) => o.value === initialMode)?.label}
              <button
                onClick={() => handleModeChange("all")}
                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {initialTags !== "all" && (
            <Badge variant="secondary" className="gap-1 pr-1.5">
              {initialTags}
              <button
                onClick={() => handleTagChange("all")}
                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground h-7 px-2"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
