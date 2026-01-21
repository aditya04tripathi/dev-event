"use client";

import { useEventContext } from "@/context/event-context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    XIcon,
    PlusIcon,
    Loader2Icon,
    AlertCircleIcon,
    ArrowLeftIcon
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import Image from "next/image";

interface AgendaItem {
    id: string;
    value: string;
}

export default function EditEventPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    const { useEvent, updateEvent } = useEventContext();
    const { data: event, isLoading: isFetching } = useEvent(eventId);
    const updateEventMutation = updateEvent;

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
    const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
    const [newAgendaItem, setNewAgendaItem] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setSlug(event.slug);
            setDescription(event.description);
            setOverview(event.overview);
            setVenue(event.venue);
            setLocation(event.location);
            setDate(event.date);
            setTime(event.time);
            setMode(event.mode as any);
            setAudience(event.audience);
            const organizerId = typeof event.organizerId === 'string'
                ? event.organizerId
                : (event.organizerId as any)?._id || "";
            setOrganizer(organizerId);
            setTags(event.tags);
            setAgendaItems(event.agenda.map((val: string, idx: number) => ({ id: idx.toString(), value: val })));
            setImagePreview(event.image);
        }
    }, [event]);

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
            const filteredAgenda = agendaItems
                .filter((item) => item.value.trim())
                .map((item) => item.value);

            const eventData: any = {
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
            };

            if (imageFile) {
                eventData.image = imageFile;
            }

            // We need to pass both id and data now as per my refactor to useUpdateEvent
            updateEventMutation.mutate({ id: eventId, eventData }, {
                onSuccess: (data) => {
                    toast.success("Event updated successfully");
                    router.push(`/dashboard`);
                },
                onError: (err: any) => {
                    setError(err.response?.data?.message || err.message || "An error occurred");
                },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            <Button
                variant="ghost"
                className="mb-6"
                onClick={() => router.back()}
            >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back
            </Button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Edit Event</h1>
                <p className="text-muted-foreground mt-1">Update the details for your event</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircleIcon className="size-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Short Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="overview">Overview</Label>
                            <Textarea
                                id="overview"
                                value={overview}
                                onChange={(e) => setOverview(e.target.value)}
                                required
                                rows={5}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Event Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="image">Replace Image (Optional)</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
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
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="venue">Venue</Label>
                                <Input
                                    id="venue"
                                    value={venue}
                                    onChange={(e) => setVenue(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    id="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mode">Event Mode</Label>
                            <Select value={mode} onValueChange={(value: any) => setMode(value)}>
                                <SelectTrigger id="mode">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="offline">Offline</SelectItem>
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={updateEventMutation.isPending}
                    >
                        {updateEventMutation.isPending && (
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Update Event
                    </Button>
                </div>
            </form>
        </div>
    );
}
