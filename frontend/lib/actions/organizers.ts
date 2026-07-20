"use server";

import { serverApiFetch } from "@/lib/api/server";

export async function listOrganizersAction() {
  const response = await serverApiFetch<unknown[]>("/organizers", {
    auth: false,
  });
  return response.data ?? [];
}
