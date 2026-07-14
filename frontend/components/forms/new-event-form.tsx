"use client";

import {
  AlertCircleIcon,
  Loader2Icon,
  PlusIcon,
  XIcon,
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEventContext } from "@/context/event-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <SectionCard
        icon={FileTextIcon}
        title="Basic Information"
        description="Essential details about your event"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Event Title <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <TypeIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="React Conf 2024"
                required
                maxLength={100}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="react-conf-2024"
                required
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                className="pl-9"
              />
            </div>
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
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Keep it concise and compelling</span>
              <span
                className={cn(description.length > 180 && "text-yellow-500")}
              >
                {description.length}/200
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="overview">
              Overview <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="overview"
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Detailed overview of the event, what attendees will learn, why they should attend..."
              required
              rows={5}
            />
          </div>
        </div>
      </SectionCard>

      {/* Event Image */}
      <SectionCard
        icon={ImageIcon}
        title="Event Image"
        description="Upload a banner image for your event"
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
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
              >
                <XIcon className="size-4 mr-1" />
                Remove
              </Button>
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
            required={!imagePreview}
          />
        </div>
      </SectionCard>

      {/* Location & Date */}
      <SectionCard
        icon={MapPinIcon}
        title="Location & Date"
        description="When and where the event takes place"
      >
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="venue">
                Venue <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building2Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Moscone Center"
                  required
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Location <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                  required
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                Date <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="March 15, 2024"
                  required
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">
                Time <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="10:00 AM"
                  required
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mode">
              Event Mode <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  value: "offline",
                  label: "In-person",
                  icon: Building2Icon,
                  color: "green",
                },
                {
                  value: "online",
                  label: "Online",
                  icon: VideoIcon,
                  color: "blue",
                },
                {
                  value: "hybrid",
                  label: "Hybrid",
                  icon: GlobeIcon,
                  color: "purple",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMode(option.value as any)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
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
                  {mode === option.value && (
                    <div className="absolute top-2 right-2 size-4 rounded-full bg-primary flex items-center justify-center">
                      <CheckIcon className="size-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Audience & Organizer */}
      <SectionCard
        icon={UsersIcon}
        title="Audience & Organizer"
        description="Who should attend and who's organizing"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="audience">
              Target Audience <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="React developers, Frontend engineers"
                required
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizer">
              Organizer <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="organizer"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="React Team & Meta"
                required
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Agenda */}
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
                  onChange={(e) => updateAgendaItem(item.id, e.target.value)}
                  placeholder="Registration & Breakfast"
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
            <Button type="button" onClick={addAgendaItem} variant="outline">
              <PlusIcon className="size-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* Tags */}
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

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pb-6 -mb-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={createEventMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createEventMutation.isPending}
          size="lg"
        >
          {createEventMutation.isPending ? (
            <>
              <Loader2Icon className="size-4 mr-2 animate-spin" />
              Creating Event...
            </>
          ) : (
            <>
              <CheckIcon className="size-4 mr-2" />
              Create Event
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
