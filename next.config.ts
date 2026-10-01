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
};

export default nextConfig;
