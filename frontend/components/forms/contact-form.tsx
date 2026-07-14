"use client";

import {
  AlertCircle,
  CheckCircle,
  Send,
  User,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSubmitContact } from "@/hooks/api/use-contact";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

    if (!formData.reason) {
      setError("Please select a reason for contacting us");
      return;
    }

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
          err.response?.data?.message ||
            err.message ||
            "Failed to send message",
        );
      },
    });
  };

  if (isSubmitted) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/10 p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/20 mb-4">
          <CheckCircle className="size-7 text-success" />
        </div>
        <h3 className="text-lg font-semibold text-success mb-2">
          Message Sent!
        </h3>
        <p className="text-sm text-muted-foreground">
          Thank you for reaching out. We&apos;ll get back to you within 24-48
          hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your name"
              className="pl-10"
              required
              disabled={contactMutation.isPending}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="you@example.com"
              className="pl-10"
              required
              disabled={contactMutation.isPending}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="reason">Reason</Label>
          <Select
            value={formData.reason}
            onValueChange={(value) =>
              setFormData({ ...formData, reason: value })
            }
            disabled={contactMutation.isPending}
          >
            <SelectTrigger id="reason">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {CONTACT_REASONS.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="Brief subject"
              className="pl-10"
              required
              disabled={contactMutation.isPending}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            placeholder="Write your message here..."
            rows={6}
            className="pl-10 pt-3 resize-none"
            required
            disabled={contactMutation.isPending}
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={contactMutation.isPending}
        loadingText="Sending..."
      >
        <Send className="size-4 mr-2" />
        Send Message
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By submitting, you agree to our{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
      </p>
    </form>
  );
}
