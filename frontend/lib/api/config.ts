export function getApiInternalBaseUrl(): string {
  const url = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3000";
  return url.replace(/\/$/, "");
}

export function getMinioInternalBaseUrl(): string {
  const url = process.env.MINIO_INTERNAL_URL ?? "http://127.0.0.1:9000";
  return url.replace(/\/$/, "");
}

export function getAppPublicBaseUrl(): string {
  const url =
    process.env.APP_PUBLIC_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://127.0.0.1:49153";
  return url.replace(/\/$/, "");
}
