import path from "node:path";
import type { NextConfig } from "next";

function minioRemotePatterns(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const publicUrl =
    process.env.NEXT_PUBLIC_MINIO_PUBLIC_URL || "http://127.0.0.1:9000";
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    {
      protocol: "http",
      hostname: "127.0.0.1",
      port: "9000",
      pathname: "/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "9000",
      pathname: "/**",
    },
  ];

  try {
    const url = new URL(publicUrl);
    const protocol = url.protocol.replace(":", "") as "http" | "https";
    patterns.push({
      protocol,
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: "/**",
    });
  } catch {
    // ignore invalid NEXT_PUBLIC_MINIO_PUBLIC_URL
  }

  return patterns;
}

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, ".."),
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: minioRemotePatterns(),
  },

  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
