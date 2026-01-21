"use client";

import { useBookingTicket } from "@/hooks/use-bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, ArrowLeftIcon, PrinterIcon, DownloadIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `event-booking.ics`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error("Failed to download ICS");
            console.error("Failed to download ICS", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading ticket...</p>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="container mx-auto py-12 px-4 max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">Ticket Not Found</h1>
                <p className="text-muted-foreground mb-8">
                    We couldn't find the ticket you're looking for. It might not exist or you don't have permission to view it.
                </p>
                <Link href="/profile">
                    <Button>Back to Profile</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-2xl print:p-0 print:max-w-none">
            <div className="mb-8 print:hidden">
                <Link href="/profile" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Profile
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Your Ticket</h1>
                        <p className="text-muted-foreground mt-1">Ready for {ticket.eventTitle}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDownloadIcs}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Add to Calendar
                        </Button>
                        <Button onClick={handlePrint} size="sm">
                            <PrinterIcon className="mr-2 h-4 w-4" />
                            Print Ticket
                        </Button>
                    </div>
                </div>
            </div>

            <Card className="border-2 border-primary/20 bg-background/50 backdrop-blur-sm shadow-2xl overflow-hidden print:shadow-none print:border-black">
                <div className="bg-primary/10 p-6 text-center border-b border-primary/10 print:bg-gray-100 print:text-black">
                    <h2 className="text-2xl font-bold text-primary print:text-black">{ticket.eventTitle}</h2>
                    <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground print:text-black">
                        <Badge variant="outline" className="text-xs font-normal border-primary/30">Admit One</Badge>
                    </div>
                </div>

                <CardContent className="p-8 flex flex-col items-center">
                    <div className="w-64 h-64 bg-white p-4 rounded-xl shadow-inner border border-border/50 mb-8 print:border-black">
                        {ticket.qrCode && (
                            <Image
                                src={ticket.qrCode}
                                alt="Ticket QR Code"
                                width={256}
                                height={256}
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>

                    <div className="w-full space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Attendee</p>
                                <p className="font-semibold text-lg">{ticket.name}</p>
                                <p className="text-sm text-muted-foreground">{ticket.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Status</p>
                                <Badge className={ticket.checkedInAt ? "bg-green-500" : "bg-primary"}>
                                    {ticket.checkedInAt ? "CHECKED IN" : "VALID"}
                                </Badge>
                            </div>
                        </div>

                        <div className="h-px w-full bg-border print:bg-black" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span className="text-xs uppercase tracking-wider">Date & Time</span>
                                </div>
                                <p className="font-medium">
                                    {new Date(ticket.eventDate).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <MapPinIcon className="h-4 w-4" />
                                    <span className="text-xs uppercase tracking-wider">Location</span>
                                </div>
                                <p className="font-medium">{ticket.eventLocation}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="bg-muted/30 p-4 text-center text-xs text-muted-foreground border-t border-primary/10 flex flex-col gap-1 print:bg-gray-100 print:text-black">
                    <p>Ticket ID: {ticket._id}</p>
                    <p>Please present this QR code at the entrance for scanning.</p>
                </CardFooter>
            </Card>

            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .container, .container * {
                        visibility: visible;
                    }
                    .container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        max-width: none !important;
                        padding: 0 !important;
                    }
                    button, a {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
