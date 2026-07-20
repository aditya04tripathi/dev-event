"use server";

import { serverApiFetch } from "@/lib/api/server";

export type ContactInput = {
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
};

export async function submitContactAction(data: ContactInput) {
  const response = await serverApiFetch<unknown>("/contact", {
    method: "POST",
    body: data,
    auth: false,
  });
  return response.data;
}
