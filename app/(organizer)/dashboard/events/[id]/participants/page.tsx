"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ArrowLeftIcon,
    TrashIcon,
    SendIcon,
    CheckCircle2Icon,
    XCircleIcon,
    SearchIcon,
    Loader2Icon,
    MailIcon,
    AlertCircleIcon,
    DownloadIcon
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useBookingContext } from "@/context/booking-context";
import { useEventContext } from "@/context/event-context";

export default function ParticipantsPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;
    const [search, setSearch] = useState("");

    const { useEvent } = useEventContext();
    const { useParticipants, checkIn, resendQRCode, removeParticipant } = useBookingContext();

    const { data: event } = useEvent(eventId);
    const { data, isLoading, isError } = useParticipants(eventId, { search });

    const removeMutation = removeParticipant; // Mutation object (actually it's the mutation logic, wait context exposed the mutation RESULT? No, context exposed the HOOK or the MUTATION OBJECT? Let's check booking-context.tsx)
    // Checking booking-context.tsx: 
    // export function BookingProvider(...) {
    //   const removeParticipantMutation = useRemoveParticipant(); // This hook returns the Mutation Object (mutate, isPending, etc)
    //   return <Provider value={{ ..., removeParticipant: removeParticipantMutation }} />
    // }
    // So 'removeParticipant' IS the mutation object.

    const handleRemove = async (bookingId: string) => {
        if (confirm("Are you sure you want to remove this participant?")) {
            removeParticipant.mutate({ eventId, bookingId }, {
                onSuccess: () => {
                    toast.success("Participant removed");
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || "Failed to remove participant");
                }
            });
        }
    };

    const handleResend = (email: string) => {
        resendQRCode.mutate({ eventId, email }, {
            onSuccess: () => {
                toast.success("QR code ticket resent successfully");
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || "Failed to resend QR code");
            }
        });
    };

    const handleExport = async () => {
        try {
            const { api } = require("@/lib/axios");
            const response = await api.get(`/booking/export-csv/${eventId}`, { // Wait, path is event/:id/export-csv? Backtrack.
                // BookingController @Controller('event/:id') -> @Get('export-csv') -> 'event/:id/export-csv'
                // So url is `/event/${eventId}/export-csv`
                url: `/event/${eventId}/export-csv`,
                responseType: 'blob',
            });
            // api.get takes url as first arg.
            // Correct: api.get(`/event/${eventId}/export-csv`, { responseType: 'blob' })
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `participants-${eventId}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error("Failed to export CSV");
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                >
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
                <Button variant="outline" onClick={handleExport}>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Participants</h1>
                    <p className="text-muted-foreground mt-1">
                        {event?.title ? `Managing attendees for "${event.title}"` : "Manage event attendees"}
                    </p>
                </div>
                <div className="relative w-full md:w-80">
                    <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-primary/10 bg-background/50 backdrop-blur-sm shadow-xl">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Registration Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center">
                                            <Loader2Icon className="h-8 w-8 animate-spin mx-auto text-primary" />
                                        </TableCell>
                                    </TableRow>
                                ) : isError ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center text-destructive">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <AlertCircleIcon className="h-8 w-8" />
                                                <p>Failed to load participants.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : !data?.participants || data.participants.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                                            No participants found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.participants.map((participant) => (
                                        <TableRow key={participant._id} className="hover:bg-primary/5 transition-colors">
                                            <TableCell className="font-medium">{participant.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <MailIcon className="h-3 w-3 text-muted-foreground" />
                                                    {participant.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {participant.checkedInAt ? (
                                                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                                                        <CheckCircle2Icon className="mr-1 h-3 w-3" />
                                                        Checked In
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">
                                                        <XCircleIcon className="mr-1 h-3 w-3" />
                                                        Registered
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>{new Date(participant.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Resend Ticket"
                                                        onClick={() => handleResend(participant.email)}
                                                        disabled={resendQRCode.isPending}
                                                    >
                                                        {resendQRCode.isPending ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        title="Remove Participant"
                                                        onClick={() => handleRemove(participant._id)}
                                                        disabled={removeParticipant.isPending}
                                                    >
                                                        {removeParticipant.isPending ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <TrashIcon className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
