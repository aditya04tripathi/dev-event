"use client";

import { AlertCircleIcon, CheckCircleIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useSubmitContact } from "@/hooks/api/use-contact";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_REASONS } from "@/lib/site-constants";

export default function ContactForm() {
	const contactMutation = useSubmitContact();
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		reason: "",
		subject: "",
		message: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		contactMutation.mutate(formData, {
			onSuccess: () => {
				setIsSubmitted(true);
				setFormData({
					name: "",
					email: "",
					reason: "",
					subject: "",
					message: "",
				});

				setTimeout(() => {
					setIsSubmitted(false);
				}, 5000);
			},
			onError: (err: any) => {
				setError(
					err.response?.data?.message || err.message || "Failed to send message"
				);
			},
		});
	};

	if (isSubmitted) {
		return (
			<div className="py-12">
				<Alert className="border-green-500/50 bg-green-500/10">
					<CheckCircleIcon className="size-5 text-green-500" />
					<AlertTitle>Message Sent Successfully!</AlertTitle>
					<AlertDescription>
						Thank you for reaching out. I&apos;ll get back to you within 24-48
						hours.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{error && (
				<Alert variant="destructive">
					<AlertCircleIcon className="size-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="grid md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="name">
						Name <span className="text-destructive">*</span>
					</Label>
					<Input
						id="name"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						placeholder="Your full name"
						required
						disabled={contactMutation.isPending}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">
						Email <span className="text-destructive">*</span>
					</Label>
					<Input
						id="email"
						type="email"
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
						placeholder="your.email@example.com"
						required
						disabled={contactMutation.isPending}
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="reason">
					Reason for Contact <span className="text-destructive">*</span>
				</Label>
				<Select
					value={formData.reason}
					onValueChange={(value) => setFormData({ ...formData, reason: value })}
					required
					disabled={contactMutation.isPending}
				>
					<SelectTrigger className="w-full" id="reason">
						<SelectValue placeholder="Select a reason" />
					</SelectTrigger>
					<SelectContent align="start">
						{CONTACT_REASONS.map((reason) => (
							<SelectItem key={reason} value={reason}>
								{reason}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label htmlFor="subject">
					Subject <span className="text-destructive">*</span>
				</Label>
				<Input
					id="subject"
					value={formData.subject}
					onChange={(e) =>
						setFormData({ ...formData, subject: e.target.value })
					}
					placeholder="Brief subject of your message"
					required
					disabled={contactMutation.isPending}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="message">
					Message <span className="text-destructive">*</span>
				</Label>
				<Textarea
					id="message"
					value={formData.message}
					onChange={(e) =>
						setFormData({ ...formData, message: e.target.value })
					}
					placeholder="Tell me more about your inquiry..."
					rows={6}
					required
					disabled={contactMutation.isPending}
				/>
				<p className="text-xs text-muted-foreground">
					{formData.message.length} characters
				</p>
			</div>

			<Button type="submit" disabled={contactMutation.isPending} className="w-full">
				{contactMutation.isPending ? (
					<>
						<Loader2Icon className="size-4 mr-2 animate-spin" />
						Sending...
					</>
				) : (
					"Send Message"
				)}
			</Button>

			<p className="text-xs text-center text-muted-foreground">
				By submitting this form, you agree to our{" "}
				<a href="/privacy" className="underline hover:text-foreground">
					Privacy Policy
				</a>
			</p>
		</form>
	);
}
