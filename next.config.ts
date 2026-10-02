import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mobilenbazaar.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "mobilenbazaar.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Default is 1MB, too small for multi-photo product uploads (images
      // are stored inline as base64, each capped at 1MB raw — see lib/uploads.ts).
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
