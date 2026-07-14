"use client";

import { useEventContext } from "@/context/event-context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BlurFade } from "@/components/ui/blur-fade";
import {
  XIcon,
  PlusIcon,
  Loader2Icon,
  AlertCircleIcon,
  ArrowLeftIcon,
  TypeIcon,
  LinkIcon,
  FileTextIcon,
  MapPinIcon,
  Building2Icon,
  CalendarIcon,
  ClockIcon,
  VideoIcon,
  GlobeIcon,
  UsersIcon,
  UserIcon,
  ListIcon,
  TagIcon,
  ImageIcon,
  CheckIcon,
  SaveIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AgendaItem {
  id: string;
  value: string;
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
          <Icon className="size-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
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
      const organizerId =
        typeof event.organizerId === "string"
          ? event.organizerId
          : (event.organizerId as any)?._id || "";
      setOrganizer(organizerId);
      setTags(event.tags);
      setAgendaItems(
        event.agenda.map((val: string, idx: number) => ({
          id: idx.toString(),
          value: val,
        })),
      );
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

      updateEventMutation.mutate(
        { id: eventId, eventData },
        {
          onSuccess: (data) => {
            toast.success("Event updated successfully");
            router.push(`/dashboard`);
          },
          onError: (err: any) => {
            setError(
              err.response?.data?.message || err.message || "An error occurred",
            );
          },
        },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (isFetching) {
    return (
      <main className="section-sm">
        <div className="container-tight">
          <Skeleton className="h-5 w-24 mb-6" />
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section-sm">
      <div className="container-tight">
        <BlurFade delay={0.05}>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 group"
          >
            <ArrowLeftIcon className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Edit Event
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Update the details for "{event?.title}"
            </p>
          </div>
        </BlurFade>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <BlurFade delay={0.1}>
              <Alert variant="destructive">
                <AlertCircleIcon className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </BlurFade>
          )}

          {/* Basic Information */}
          <BlurFade delay={0.1}>
            <SectionCard
              icon={FileTextIcon}
              title="Basic Information"
              description="Essential details about your event"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <div className="relative">
                    <TypeIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    maxLength={200}
                    rows={3}
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span
                      className={cn(
                        description.length > 180 && "text-yellow-500",
                      )}
                    >
                      {description.length}/200
                    </span>
                  </div>
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
              </div>
            </SectionCard>
          </BlurFade>

          {/* Event Image */}
          <BlurFade delay={0.15}>
            <SectionCard
              icon={ImageIcon}
              title="Event Image"
              description="Update the banner image for your event"
            >
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative group">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label
                      htmlFor="image"
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
                    >
                      <span className="text-white text-sm font-medium">
                        Click to replace
                      </span>
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-3 rounded-full bg-muted">
                      <ImageIcon className="size-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Click to upload</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, WebP up to 5MB
                      </p>
                    </div>
                  </label>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </SectionCard>
          </BlurFade>

          {/* Location & Date */}
          <BlurFade delay={0.2}>
            <SectionCard
              icon={MapPinIcon}
              title="Location & Date"
              description="When and where the event takes place"
            >
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue</Label>
                    <div className="relative">
                      <Building2Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="venue"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        required
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Event Mode</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        value: "offline",
                        label: "In-person",
                        icon: Building2Icon,
                      },
                      { value: "online", label: "Online", icon: VideoIcon },
                      { value: "hybrid", label: "Hybrid", icon: GlobeIcon },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setMode(option.value as any)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all relative",
                          mode === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <option.icon
                          className={cn(
                            "size-5",
                            mode === option.value
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-medium",
                            mode === option.value
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </BlurFade>

          {/* Audience & Organizer */}
          <BlurFade delay={0.25}>
            <SectionCard
              icon={UsersIcon}
              title="Audience & Organizer"
              description="Who should attend and who's organizing"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <div className="relative">
                    <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="audience"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      required
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          </BlurFade>

          {/* Agenda */}
          <BlurFade delay={0.3}>
            <SectionCard
              icon={ListIcon}
              title="Agenda"
              description="Event schedule and activities"
            >
              <div className="space-y-4">
                <div className="space-y-3">
                  {agendaItems.map((item, index) => (
                    <div key={item.id} className="flex gap-2 items-center">
                      <div className="flex items-center justify-center size-8 rounded-full bg-muted text-sm font-medium shrink-0">
                        {index + 1}
                      </div>
                      <Input
                        id={`agenda-${item.id}`}
                        value={item.value}
                        onChange={(e) =>
                          updateAgendaItem(item.id, e.target.value)
                        }
                        placeholder="Agenda item..."
                        className="flex-1"
                      />
                      {agendaItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeAgendaItem(item.id)}
                        >
                          <XIcon className="size-4" />
                        </Button>
                      )}
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
                  <Button
                    type="button"
                    onClick={addAgendaItem}
                    variant="outline"
                  >
                    <PlusIcon className="size-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </SectionCard>
          </BlurFade>

          {/* Tags */}
          <BlurFade delay={0.35}>
            <SectionCard
              icon={TagIcon}
              title="Tags"
              description="Keywords to help people find your event"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 min-h-12 p-3 border border-border rounded-lg bg-muted/30">
                  {tags.length === 0 ? (
                    <span className="text-sm text-muted-foreground py-1">
                      No tags added yet
                    </span>
                  ) : (
                    tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1.5 gap-1.5"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive transition-colors"
                        >
                          <XIcon className="size-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      className="pl-9"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                  </div>
                  <Button type="button" onClick={addTag} variant="outline">
                    <PlusIcon className="size-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </SectionCard>
          </BlurFade>

          {/* Actions */}
          <BlurFade delay={0.4}>
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={updateEventMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateEventMutation.isPending}
                size="lg"
              >
                {updateEventMutation.isPending ? (
                  <>
                    <Loader2Icon className="size-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <SaveIcon className="size-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </BlurFade>
        </form>
      </div>
    </main>
  );
}
