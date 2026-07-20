"use server";

import { serverApiFetch } from "@/lib/api/server";

export type OrganizerStats = {
  totalEvents: number;
  totalBookings: number;
  totalCheckIns: number;
  events: unknown[];
};

export async function getOrganizerStatsAction() {
  const response = await serverApiFetch<OrganizerStats>("/analytics/organizer");
  return response.data;
}
