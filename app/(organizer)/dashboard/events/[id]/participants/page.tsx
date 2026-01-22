"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeftIcon,
  TrashIcon,
  SendIcon,
  CheckCircle2Icon,
  XCircleIcon,
  SearchIcon,
  Loader2Icon,
  AlertCircleIcon,
  DownloadIcon,
  UsersIcon,
  MailIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BlurFade } from "@/components/ui/blur-fade";
import { useBookingContext } from "@/context/booking-context";
import { useEventContext } from "@/context/event-context";
import Link from "next/link";

export default function ParticipantsPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [search, setSearch] = useState("");

  const { useEvent } = useEventContext();
  const { useParticipants, resendQRCode, removeParticipant } =
    useBookingContext();

  const { data: event } = useEvent(eventId);
  const { data, isLoading, isError } = useParticipants(eventId, { search });

  const handleRemove = async (bookingId: string) => {
    if (confirm("Are you sure you want to remove this participant?")) {
      removeParticipant.mutate(
        { eventId, bookingId },
        {
          onSuccess: () => {
            toast.success("Participant removed");
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message || "Failed to remove participant",
            );
          },
        },
      );
    }
  };

  const handleResend = (email: string) => {
    resendQRCode.mutate(
      { eventId, email },
      {
        onSuccess: () => {
          toast.success("QR code ticket resent successfully");
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Failed to resend QR code",
          );
        },
      },
    );
  };

  const handleExport = async () => {
    try {
      const { api } = require("@/lib/axios");
      const response = await api.get(`/event/${eventId}/export-csv`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `participants-${eventId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("CSV exported successfully");
    } catch (error) {
      toast.error("Failed to export CSV");
    }
  };

  const participantCount = data?.participants?.length || 0;

  return (
    <main className="section-sm">
      <div className="container-wide">
        {/* Header */}
        <BlurFade delay={0.05}>
          <div className="flex flex-col gap-6 mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground w-fit group"
            >
              <ArrowLeftIcon className="size-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Dashboard
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Participants
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  {event?.title
                    ? `Managing attendees for "${event.title}"`
                    : "Manage event attendees"}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <DownloadIcon className="size-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </BlurFade>

        {/* Stats */}
        <BlurFade delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-500/10">
                  <UsersIcon className="size-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{participantCount}</p>
                  <p className="text-xs text-muted-foreground">
                    Total Registered
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-green-500/10">
                  <CheckCircle2Icon className="size-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">
                    {data?.participants?.filter((p) => p.checkedInAt).length ||
                      0}
                  </p>
                  <p className="text-xs text-muted-foreground">Checked In</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-yellow-500/10">
                  <XCircleIcon className="size-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">
                    {data?.participants?.filter((p) => !p.checkedInAt).length ||
                      0}
                  </p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>

        {/* Table */}
        <BlurFade delay={0.15}>
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Email</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Registered</TableHead>
                  <TableHead className="text-right font-medium">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-48 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="rounded-full bg-destructive/10 p-3">
                          <AlertCircleIcon className="size-6 text-destructive" />
                        </div>
                        <p className="text-sm">Failed to load participants.</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.reload()}
                        >
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !data?.participants || data.participants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="rounded-full bg-muted p-3">
                          <UsersIcon className="size-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {search
                            ? "No participants match your search."
                            : "No participants yet."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.participants.map((participant) => (
                    <TableRow
                      key={participant._id}
                      className="hover:bg-muted/30"
                    >
                      <TableCell className="font-medium">
                        {participant.name}
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {participant.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        {participant.checkedInAt ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2Icon className="size-3" />
                            Checked In
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            Registered
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(participant.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            title="Resend Ticket"
                            onClick={() => handleResend(participant.email)}
                            disabled={resendQRCode.isPending}
                          >
                            {resendQRCode.isPending ? (
                              <Loader2Icon className="size-4 animate-spin" />
                            ) : (
                              <MailIcon className="size-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Remove Participant"
                            onClick={() => handleRemove(participant._id)}
                            disabled={removeParticipant.isPending}
                          >
                            {removeParticipant.isPending ? (
                              <Loader2Icon className="size-4 animate-spin" />
                            ) : (
                              <TrashIcon className="size-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </BlurFade>
      </div>
    </main>
  );
}
