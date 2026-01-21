"use client";

import { AlertCircleIcon, CheckCircleIcon, Loader2Icon, LogInIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { useBookingContext } from "@/context/booking-context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface BookEventProps {
	eventId: string;
}

const BookEvent = ({ eventId }: BookEventProps) => {
	const { user, isLoading } = useAuth();
	const { bookEvent } = useBookingContext();
	const router = useRouter();
	const pathname = usePathname();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (user) {
			setName(user.fullName || "");
			setEmail(user.email || "");
		}
	}, [user]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		bookEvent.mutate(
			{ eventId, bookingData: { name, email } },
			{
				onSuccess: () => {
					setSubmitted(true);
					// Don't clear form if user is logged in, keeps context
					if (!user) {
						setName("");
						setEmail("");
					}
				},
				onError: (err: any) => {
					setError(
						err.response?.data?.message ||
						err.message ||
						"Failed to book event",
					);
				},
			},
		);
	};

	if (submitted) {
		return (
			<Alert className="border-green-500/50 bg-green-500/10">
				<CheckCircleIcon className="size-5 text-green-500" />
				<AlertTitle>Booking Confirmed!</AlertTitle>
				<AlertDescription>
					Thank you for booking your spot! We&apos;ve sent a confirmation email
					with your event QR code. Please check your inbox.
				</AlertDescription>
			</Alert>
		);
	}

	if (isLoading) {
		return (
			<div className="flex justify-center p-4">
				<Loader2Icon className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!user) {
		return (
			<Alert className="bg-primary/5 border-primary/20">
				<AlertTitle className="mb-2">Login Required</AlertTitle>
				<AlertDescription className="flex flex-col gap-4">
					<p>You must be logged in to book this event.</p>
					<Button asChild className="w-full">
						<Link href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}>
							<LogInIcon className="mr-2 size-4" />
							Login to Book
						</Link>
					</Button>
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{error && (
				<Alert variant="destructive">
					<AlertCircleIcon className="size-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="space-y-2">
				<Label htmlFor="name">
					Full Name <span className="text-destructive">*</span>
				</Label>
				<Input
					type="text"
					id="name"
					value={name}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setName(e.target.value)
					}
					placeholder="John Doe"
					required
					disabled={bookEvent.isPending || !!user} // Disable if user is logged in? Maybe allow editing name? Usually name is fixed for account. Let's allow editing but pre-fill.
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="email">
					Email <span className="text-destructive">*</span>
				</Label>
				<Input
					type="email"
					id="email"
					value={email}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setEmail(e.target.value)
					}
					placeholder="john@doe.com"
					required
					disabled={bookEvent.isPending || !!user} // Disable email edit for logged in user to match account
				/>
				{user && (
					<p className="text-xs text-muted-foreground">
						Booking as {user.email}
					</p>
				)}
			</div>

			<Button
				type="submit"
				className="w-full"
				disabled={bookEvent.isPending}
			>
				{bookEvent.isPending ? (
					<>
						<Loader2Icon className="size-4 mr-2 animate-spin" />
						Booking...
					</>
				) : (
					"Book Now"
				)}
			</Button>
		</form>
	);
};

export default BookEvent;
