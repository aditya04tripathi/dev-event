"use client";

import { AlertCircleIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEventContext } from "@/context/event-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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

interface AgendaItem {
	id: string;
	value: string;
}

export default function NewEventForm() {
	const router = useRouter();
	const { createEvent } = useEventContext();
	const createEventMutation = createEvent;
	const [error, setError] = useState<string | null>(null);

	const [title, setTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [description, setDescription] = useState("");
	const [overview, setOverview] = useState("");
	const [venue, setVenue] = useState("");
	const [location, setLocation] = useState("");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [mode, setMode] = useState<"offline" | "online" | "hybrid">("offline");
	const [audience, setAudience] = useState("");
	const [organizer, setOrganizer] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
		{ id: "1", value: "" },
	]);
	const [newAgendaItem, setNewAgendaItem] = useState("");

	const [tags, setTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState("");

	const handleTitleChange = (value: string) => {
		setTitle(value);
		const generatedSlug = value
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
		setSlug(generatedSlug);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const addAgendaItem = () => {
		if (newAgendaItem.trim()) {
			setAgendaItems([
				...agendaItems,
				{ id: Date.now().toString(), value: newAgendaItem.trim() },
			]);
			setNewAgendaItem("");
		}
	};

	const removeAgendaItem = (id: string) => {
		setAgendaItems(agendaItems.filter((item) => item.id !== id));
	};

	const updateAgendaItem = (id: string, value: string) => {
		setAgendaItems(
			agendaItems.map((item) => (item.id === id ? { ...item, value } : item)),
		);
	};

	const addTag = () => {
		if (newTag.trim() && !tags.includes(newTag.trim())) {
			setTags([...tags, newTag.trim()]);
			setNewTag("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		try {
			if (!title || !slug || !description || !overview || !venue || !location) {
				throw new Error("Please fill in all required fields");
			}

			if (!imageFile) {
				throw new Error("Please upload an event image");
			}

			const filteredAgenda = agendaItems
				.filter((item) => item.value.trim())
				.map((item) => item.value);

			if (filteredAgenda.length === 0) {
				throw new Error("Please add at least one agenda item");
			}

			if (tags.length === 0) {
				throw new Error("Please add at least one tag");
			}

			const eventData = {
				title,
				slug,
				description,
				overview,
				venue,
				location,
				date,
				time,
				mode,
				audience,
				organizer,
				agenda: JSON.stringify(filteredAgenda),
				tags: JSON.stringify(tags),
				image: imageFile,
			};

			createEventMutation.mutate(eventData, {
				onSuccess: (data) => {
					// Redirect to the event detail page (public) OR dashboard?
					// Usually after creating, go to dashboard.
					router.push(`/dashboard`);
				},
				onError: (err: any) => {
					setError(
						err.response?.data?.message || err.message || "An error occurred",
					);
				},
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
			{error && (
				<Alert variant="destructive">
					<AlertCircleIcon className="size-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Basic Information</CardTitle>
					<CardDescription>Essential details about your event</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">
							Event Title <span className="text-destructive">*</span>
						</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => handleTitleChange(e.target.value)}
							placeholder="React Conf 2024"
							required
							maxLength={100}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="slug">
							Slug <span className="text-destructive">*</span>
						</Label>
						<Input
							id="slug"
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
							placeholder="react-conf-2024"
							required
							pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
						/>
						<p className="text-xs text-muted-foreground">
							URL-friendly identifier (auto-generated from title)
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">
							Short Description <span className="text-destructive">*</span>
						</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="A brief description of the event..."
							required
							maxLength={200}
							rows={3}
						/>
						<p className="text-xs text-muted-foreground">
							{description.length}/200 characters
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="overview">
							Overview <span className="text-destructive">*</span>
						</Label>
						<Textarea
							id="overview"
							value={overview}
							onChange={(e) => setOverview(e.target.value)}
							placeholder="Detailed overview of the event..."
							required
							rows={5}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Event Image</CardTitle>
					<CardDescription>
						Upload a banner image for your event
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="image">
							Image <span className="text-destructive">*</span>
						</Label>
						<Input
							id="image"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							required
						/>
					</div>
					{imagePreview && (
						<div className="relative w-full aspect-video rounded overflow-hidden border">
							<img
								src={imagePreview}
								alt="Event preview"
								className="w-full h-full object-cover"
							/>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Location & Date</CardTitle>
					<CardDescription>
						When and where the event takes place
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="venue">
								Venue <span className="text-destructive">*</span>
							</Label>
							<Input
								id="venue"
								value={venue}
								onChange={(e) => setVenue(e.target.value)}
								placeholder="Moscone Center"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="location">
								Location <span className="text-destructive">*</span>
							</Label>
							<Input
								id="location"
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								placeholder="San Francisco, CA"
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="date">
								Date <span className="text-destructive">*</span>
							</Label>
							<Input
								id="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								placeholder="March 15, 2024"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="time">
								Time <span className="text-destructive">*</span>
							</Label>
							<Input
								id="time"
								value={time}
								onChange={(e) => setTime(e.target.value)}
								placeholder="10:00 PM / 22:00"
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="mode">
							Event Mode <span className="text-destructive">*</span>
						</Label>
						<Select value={mode} onValueChange={(value: any) => setMode(value)}>
							<SelectTrigger id="mode">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="offline">Offline (In-person)</SelectItem>
								<SelectItem value="online">Online (Virtual)</SelectItem>
								<SelectItem value="hybrid">Hybrid</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Audience & Organizer</CardTitle>
					<CardDescription>
						Who should attend and who&apos;s organizing
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="audience">
							Target Audience <span className="text-destructive">*</span>
						</Label>
						<Input
							id="audience"
							value={audience}
							onChange={(e) => setAudience(e.target.value)}
							placeholder="React developers, Frontend engineers"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="organizer">
							Organizer <span className="text-destructive">*</span>
						</Label>
						<Input
							id="organizer"
							value={organizer}
							onChange={(e) => setOrganizer(e.target.value)}
							placeholder="React Team & Meta"
							required
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Agenda</CardTitle>
					<CardDescription>Event schedule and activities</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-3">
						{agendaItems.map((item, index) => (
							<div key={item.id} className="flex gap-2">
								<div className="flex-1 space-y-2">
									<Label htmlFor={`agenda-${item.id}`}>Item {index + 1}</Label>
									<div className="flex gap-2">
										<Input
											id={`agenda-${item.id}`}
											value={item.value}
											onChange={(e) =>
												updateAgendaItem(item.id, e.target.value)
											}
											placeholder="Registration & Breakfast"
										/>
										{agendaItems.length > 1 && (
											<Button
												type="button"
												variant="outline"
												size="icon"
												onClick={() => removeAgendaItem(item.id)}
											>
												<XIcon className="size-4" />
											</Button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="flex gap-2">
						<Input
							value={newAgendaItem}
							onChange={(e) => setNewAgendaItem(e.target.value)}
							placeholder="Add new agenda item..."
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									addAgendaItem();
								}
							}}
						/>
						<Button type="button" onClick={addAgendaItem} variant="outline">
							<PlusIcon className="size-4 mr-2" />
							Add
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Tags</CardTitle>
					<CardDescription>
						Keywords to help people find your event
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded">
						{tags.length === 0 ? (
							<span className="text-sm text-muted-foreground">
								No tags added yet
							</span>
						) : (
							tags.map((tag) => (
								<Badge key={tag} variant="secondary" className="px-3 py-1">
									{tag}
									<button
										type="button"
										onClick={() => removeTag(tag)}
										className="ml-2 hover:text-destructive"
									>
										<XIcon className="size-3" />
									</button>
								</Badge>
							))
						)}
					</div>

					<div className="flex gap-2">
						<Input
							value={newTag}
							onChange={(e) => setNewTag(e.target.value)}
							placeholder="Add a tag..."
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									addTag();
								}
							}}
						/>
						<Button type="button" onClick={addTag} variant="outline">
							<PlusIcon className="size-4 mr-2" />
							Add
						</Button>
					</div>
				</CardContent>
			</Card>

			<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-2">
				<Button
					type="button"
					variant="outline"
					onClick={() => router.back()}
					disabled={createEventMutation.isPending}
					className="w-full sm:w-auto"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={createEventMutation.isPending}
					className="w-full sm:w-auto"
				>
					{createEventMutation.isPending ? (
						<>
							<Loader2Icon className="size-4 mr-2 animate-spin" />
							Creating...
						</>
					) : (
						"Create Event"
					)}
				</Button>
			</div>
		</form>
	);
}
