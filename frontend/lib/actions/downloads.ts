"use server";

import { serverApiFetchBinary } from "@/lib/api/server";

function toBase64(data: Uint8Array): string {
  return Buffer.from(data).toString("base64");
}

export async function downloadTicketIcsAction(ticketId: string) {
  const { data, contentType } = await serverApiFetchBinary(
    `/bookings/ticket/${ticketId}/ics`,
  );
  return {
    base64: toBase64(data),
    contentType,
    filename: "event-booking.ics",
  };
}

export async function exportParticipantsCsvAction(eventId: string) {
  const { data, contentType } = await serverApiFetchBinary(
    `/event/${eventId}/export-csv`,
  );
  return {
    base64: toBase64(data),
    contentType,
    filename: `participants-${eventId}.csv`,
  };
}
