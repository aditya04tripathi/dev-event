import type { NextConfig } from "next";

function minioRemotePatterns(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const appUrl = process.env.APP_PUBLIC_URL ?? "http://127.0.0.1:49153";
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    {
      protocol: "http",
      hostname: "127.0.0.1",
      port: "49153",
      pathname: "/api/storage/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "49153",
      pathname: "/api/storage/**",
    },
    {
      protocol: "http",
      hostname: "127.0.0.1",
      port: "3001",
      pathname: "/api/storage/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "3001",
      pathname: "/api/storage/**",
    },
  ];

  try {
    const url = new URL(appUrl);
    const protocol = url.protocol.replace(":", "") as "http" | "https";
    patterns.push({
      protocol,
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: "/api/storage/**",
    });
  } catch {
    // ignore invalid APP_PUBLIC_URL
  }

  return patterns;
}

const nextConfig: NextConfig = {
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
