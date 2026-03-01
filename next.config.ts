import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/icon" },
      { source: "/apple-touch-icon.png", destination: "/apple-icon" },
      { source: "/apple-touch-icon-precomposed.png", destination: "/apple-icon" },
    ];
  },
};

export default nextConfig;
