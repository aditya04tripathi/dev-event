import { NextRequest, NextResponse } from "next/server";
import { getMinioInternalBaseUrl } from "@/lib/api/config";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const objectPath = path.join("/");
  const base = getMinioInternalBaseUrl();
  const targetUrl = `${base}/${objectPath}`;

  const upstream = await fetch(targetUrl, { method: "GET" });

  if (!upstream.ok) {
    return new NextResponse(null, { status: upstream.status });
  }

  const contentType =
    upstream.headers.get("content-type") ?? "application/octet-stream";
  const cacheControl =
    upstream.headers.get("cache-control") ?? "public, max-age=86400";

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": cacheControl,
    },
  });
}
