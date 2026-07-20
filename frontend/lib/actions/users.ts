"use server";

import { serverApiFetch } from "@/lib/api/server";
import type { UserResponse } from "@/types/api-types";

export async function getUserAction(id: string) {
  const response = await serverApiFetch<UserResponse>(`/user/${id}`, {
    auth: false,
  });
  return response.data;
}
