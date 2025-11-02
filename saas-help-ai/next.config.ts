import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["ik.imagekit.io"],
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  reactCompiler: true,
};

export default nextConfig;
