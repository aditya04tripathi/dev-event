"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/auth-context";
import { EventProvider } from "@/context/event-context";
import { BookingProvider } from "@/context/booking-context";

const Providers = ({ children }: { children: React.ReactNode }) => {
	const [queryClient] = useState(() => new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
				refetchOnWindowFocus: false,
			},
		},
	}));

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<EventProvider>
					<BookingProvider>
						{children}
						<Toaster />
					</BookingProvider>
				</EventProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
};

export default Providers;
