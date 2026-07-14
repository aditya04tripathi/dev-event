"use client";

import {
  AlertCircleIcon,
  CheckCircleIcon,
  LogInIcon,
  Ticket,
  User,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { useBookingContext } from "@/context/booking-context";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface BookEventProps {
  eventId: string;
}

const BookEvent = ({ eventId }: BookEventProps) => {
  const { user, isLoading } = useAuth();
  const { bookEvent } = useBookingContext();
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
      <div className="rounded-xl bg-success/10 border border-success/20 p-6 text-center space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/20">
          <CheckCircleIcon className="size-6 text-success" />
        </div>
        <div>
          <h4 className="font-semibold text-success">Booking Confirmed!</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Check your email for the confirmation and QR code.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/profile">
            <Ticket className="mr-2 size-4" />
            View My Tickets
          </Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-muted/50 p-4 text-center">
          <LogInIcon className="mx-auto size-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-1">
            Sign in to register for this event
          </p>
        </div>
        <Button asChild className="w-full" size="lg">
          <Link href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}>
            <LogInIcon className="mr-2 size-4" />
            Sign in to Book
          </Link>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="py-3">
          <AlertCircleIcon className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="pl-9"
            required
            disabled={bookEvent.isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="pl-9"
            required
            disabled={bookEvent.isPending || !!user}
          />
        </div>
        {user && (
          <p className="text-xs text-muted-foreground">
            Booking as {user.email}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={bookEvent.isPending}
        loadingText="Booking..."
      >
        <Ticket className="mr-2 size-4" />
        Book My Spot
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Free event • No payment required
      </p>
    </form>
  );
};

export default BookEvent;
