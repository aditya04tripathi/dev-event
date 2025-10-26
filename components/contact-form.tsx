"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CONTACT_REASONS } from "@/lib/site-constants";
import { Loader2Icon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import { submitContactForm } from "@/lib/actions/contact.action";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
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
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        />
        <p className="text-xs text-muted-foreground">
          {formData.message.length} characters
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
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
