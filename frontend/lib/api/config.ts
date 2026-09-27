export function getApiInternalBaseUrl(): string {
  const url = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3000";
  return url.replace(/\/$/, "");
}

export function getStorageInternalBaseUrl(): string {
  const url =
    process.env.STORAGE_INTERNAL_URL ??
    "http://127.0.0.1:8888";
  return url.replace(/\/$/, "");
}

export function getAppPublicBaseUrl(): string {
  const url =
    process.env.APP_PUBLIC_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.RAILWAY_PUBLIC_DOMAIN
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : "http://127.0.0.1:49153");
  return url.replace(/\/$/, "");
}
