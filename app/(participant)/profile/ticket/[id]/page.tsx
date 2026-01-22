"use client";

import { useBookingTicket } from "@/hooks/use-bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarIcon,
  MapPinIcon,
  ArrowLeftIcon,
  PrinterIcon,
  DownloadIcon,
  Clock,
  User,
  Mail,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { toast } from "sonner";

export default function TicketPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: ticket, isLoading, error } = useBookingTicket(id);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadIcs = async () => {
    try {
      const { api } = require("@/lib/axios");
      const response = await api.get(`/bookings/ticket/${id}/ics`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `event-booking.ics`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Calendar file downloaded!");
    } catch (error) {
      toast.error("Failed to download calendar file");
      console.error("Failed to download ICS", error);
    }
  };

  if (isLoading) {
    return (
      <div className="section-sm">
        <div className="container-tight max-w-2xl">
          <Skeleton className="h-5 w-32 mb-8" />
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2 mb-8" />
          <Skeleton className="h-[600px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-6 text-center px-4">
        <div className="rounded-full bg-destructive/10 p-5">
          <CalendarIcon className="size-10 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold mb-2">Ticket Not Found</h1>
          <p className="text-muted-foreground max-w-sm">
            We couldn&apos;t find this ticket. It might not exist or you
            don&apos;t have permission to view it.
          </p>
        </div>
        <Button asChild>
          <Link href="/profile">Back to Profile</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="section-sm print:py-0">
      <div className="container-tight max-w-2xl print:max-w-none print:p-0">
        {/* Header */}
        <div className="mb-8 print:hidden">
          <BlurFade delay={0.05}>
            <Link
              href="/profile"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
            >
              <ArrowLeftIcon className="size-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to Profile
            </Link>
          </BlurFade>

          <BlurFade delay={0.1}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Your Ticket
                </h1>
                <p className="text-muted-foreground mt-1">
                  {ticket.eventTitle}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadIcs}>
                  <DownloadIcon className="mr-2 size-4" />
                  Add to Calendar
                </Button>
                <Button onClick={handlePrint} size="sm">
                  <PrinterIcon className="mr-2 size-4" />
                  Print
                </Button>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Ticket Card */}
        <BlurFade delay={0.15}>
          <Card className="overflow-hidden shadow-xl border-2 print:shadow-none print:border print:border-black">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 sm:p-8 text-center border-b print:bg-gray-100">
              <Badge className="mb-4" variant="secondary">
                Admit One
              </Badge>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                {ticket.eventTitle}
              </h2>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="size-4" />
                  {new Date(ticket.eventDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="size-4" />
                  {ticket.eventLocation}
                </span>
              </div>
            </div>

            <CardContent className="p-6 sm:p-8">
              {/* QR Code */}
              <div className="flex justify-center mb-8">
                <div className="relative bg-white p-4 rounded-2xl shadow-inner border-2 border-border">
                  {ticket.qrCode && (
                    <Image
                      src={ticket.qrCode}
                      alt="Ticket QR Code"
                      width={200}
                      height={200}
                      className="w-48 h-48 object-contain"
                    />
                  )}
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 size-4 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                  <div className="absolute top-0 right-0 size-4 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 size-4 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 size-4 border-b-2 border-r-2 border-primary rounded-br-lg" />
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center mb-8">
                {ticket.checkedInAt ? (
                  <Badge variant="success" className="text-sm py-1.5 px-4">
                    <CheckCircle2 className="size-4 mr-1.5" />
                    Checked In
                  </Badge>
                ) : (
                  <Badge className="bg-primary text-primary-foreground text-sm py-1.5 px-4">
                    Valid Ticket
                  </Badge>
                )}
              </div>

              {/* Ticket Details */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted shrink-0">
                      <User className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
                        Attendee
                      </p>
                      <p className="font-medium">{ticket.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted shrink-0">
                      <Mail className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
                        Email
                      </p>
                      <p className="font-medium text-sm break-all">
                        {ticket.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted shrink-0">
                      <CalendarIcon className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
                        Date
                      </p>
                      <p className="font-medium">
                        {new Date(ticket.eventDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted shrink-0">
                      <MapPinIcon className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
                        Location
                      </p>
                      <p className="font-medium">{ticket.eventLocation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-muted/50 px-6 py-4 flex flex-col gap-1 text-center text-xs text-muted-foreground border-t print:bg-gray-50">
              <p className="font-mono">Ticket ID: {ticket._id}</p>
              <p>Present this QR code at the entrance for scanning</p>
            </CardFooter>
          </Card>
        </BlurFade>

        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .container-tight,
            .container-tight * {
              visibility: visible;
            }
            .container-tight {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              max-width: none !important;
              padding: 1rem !important;
            }
            button,
            a {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
