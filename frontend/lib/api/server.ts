import { cookies } from "next/headers";
import type { ApiResponse } from "@/types/api-types";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth/constants";
import { getApiInternalBaseUrl } from "./config";

type QueryParams = Record<
  string,
  string | number | boolean | string[] | undefined | null
>;

type ServerFetchOptions = {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  auth?: boolean;
};

function buildQueryString(params?: QueryParams): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        search.append(key, String(item));
      }
    } else {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

function formatApiError(payload: ApiResponse<unknown>, status: number): string {
  if (payload.error) return payload.error;
  return `Request failed (${status})`;
}

async function buildHeaders(
  options: ServerFetchOptions,
  jsonBody: boolean,
): Promise<Headers> {
  const headers = new Headers(options.headers);
  if (jsonBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (options.auth !== false) {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return headers;
}

export async function serverApiFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<ApiResponse<T>> {
  const base = getApiInternalBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}${normalizedPath}`;
  const jsonBody = options.body !== undefined;

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: await buildHeaders(options, jsonBody),
    body:
      options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
    next: options.next,
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || payload.success === false) {
    throw new Error(formatApiError(payload, response.status));
  }

  return payload;
}

export async function serverApiFetchQuery<T>(
  path: string,
  params?: QueryParams,
  options: Omit<ServerFetchOptions, "body"> = {},
): Promise<ApiResponse<T>> {
  return serverApiFetch<T>(`${path}${buildQueryString(params)}`, options);
}

export async function serverApiFetchFormData<T>(
  path: string,
  formData: FormData,
  method: "POST" | "PATCH" = "POST",
): Promise<ApiResponse<T>> {
  const base = getApiInternalBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}${normalizedPath}`;

  const response = await fetch(url, {
    method,
    headers: await buildHeaders({}, false),
    body: formData,
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || payload.success === false) {
    throw new Error(formatApiError(payload, response.status));
  }

  return payload;
}

export async function serverApiFetchBinary(path: string): Promise<{
  data: Uint8Array;
  contentType: string;
}> {
  const base = getApiInternalBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}${normalizedPath}`;

  const response = await fetch(url, {
    method: "GET",
    headers: await buildHeaders({}, false),
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  const buffer = new Uint8Array(await response.arrayBuffer());
  const contentType =
    response.headers.get("content-type") ?? "application/octet-stream";

  return { data: buffer, contentType };
}
