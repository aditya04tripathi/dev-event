"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface SearchBarProps {
  initialSearch?: string;
}

export default function SearchBar({ initialSearch = "" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("search", term);
      params.set("page", "1"); // Reset to first page on search
    } else {
      params.delete("search");
    }

    router.push(`/events?${params.toString()}`);
  }, 300);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  return (
    <div className="relative max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        placeholder="Search events..."
        className="pl-10"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          handleSearch(e.target.value);
        }}
      />
    </div>
  );
}
