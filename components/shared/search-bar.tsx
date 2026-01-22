"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  initialSearch?: string;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  initialSearch = "",
  placeholder = "Search events...",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("search", term);
      params.set("page", "1");
    } else {
      params.delete("search");
    }

    router.push(`/events?${params.toString()}`);
  }, 300);

  const clearSearch = () => {
    setSearch("");
    handleSearch("");
  };

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  return (
    <div className={cn("relative w-full sm:max-w-xs", className)}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-10 pr-10"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      {search && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 size-7 text-muted-foreground hover:text-foreground"
          onClick={clearSearch}
        >
          <X className="size-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
