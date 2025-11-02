"use client";

import { AlertCircleIcon, CheckCircleIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBooking } from "@/lib/actions/booking.action";

interface BookEventProps {
	eventId: string;
}

const BookEvent = ({ eventId }: BookEventProps) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			const result = await createBooking({
				eventId,
				name,
				email,
			});

			if (!result.success) {
				throw new Error(result.message);
			}

			setSubmitted(true);
			setName("");
			setEmail("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to book event");
		} finally {
			setIsSubmitting(false);
		}
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
					onChange={(e) => setName(e.target.value)}
					placeholder="John Doe"
					required
					disabled={isSubmitting}
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
					onChange={(e) => setEmail(e.target.value)}
					placeholder="john@doe.com"
					required
					disabled={isSubmitting}
				/>
			</div>

			<Button type="submit" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? (
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
