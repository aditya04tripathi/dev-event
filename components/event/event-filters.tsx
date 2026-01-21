"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
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

interface EventFiltersProps {
	initialMode?: string;
	initialTags?: string;
}

export default function EventFilters({
	initialMode = "all",
	initialTags = "all",
}: EventFiltersProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Fetch tags by getting a batch of events and extracting tags
	// This is a bit inefficient but consistent with the requirement for "only TanStack Query"
	// until a dedicated backend endpoint is added.
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
