"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface EventFiltersProps {
  allTags: string[];
  initialMode?: string;
  initialTags?: string;
}

export default function EventFilters({
  allTags,
  initialMode = "all",
  initialTags = "all",
}: EventFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleModeChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("mode");
    } else {
      params.set("mode", value);
    }
    params.set("page", "1"); // Reset to first page
    router.push(`/events?${params.toString()}`);
  };

  const handleTagChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("tags");
    } else {
      params.set("tags", value);
    }
    params.set("page", "1"); // Reset to first page
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Select value={initialMode} onValueChange={handleModeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Event Mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Modes</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="hybrid">Hybrid</SelectItem>
        </SelectContent>
      </Select>

      {allTags.length > 0 && (
        <Select value={initialTags} onValueChange={handleTagChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Tag" />
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
    </div>
  );
}
