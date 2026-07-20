"use server";

import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth/constants";
import { serverApiFetch } from "@/lib/api/server";
import type { AuthResponse } from "@/types/api-types";

export type SignInInput = {
  usernameOrEmail: string;
  password: string;
};

export type SignUpInput = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: string;
};

async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function signInAction(input: SignInInput) {
  const response = await serverApiFetch<AuthResponse>("/auth/sign-in", {
    method: "POST",
    body: input,
    auth: false,
  });
  await setAuthCookie(response.data.token);
  return response.data;
}

export async function signUpAction(input: SignUpInput) {
  const response = await serverApiFetch<AuthResponse>("/auth/sign-up", {
    method: "POST",
    body: input,
    auth: false,
  });
  await setAuthCookie(response.data.token);
  return response.data;
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN_COOKIE);
}
