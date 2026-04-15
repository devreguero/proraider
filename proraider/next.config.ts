import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.metaforge.app',
        pathname: '/arc-raiders/icons/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.arctracker.io',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/web-arc-raiders-cms-assets/**',
      },
    ],
  },
};

export default nextConfig;
