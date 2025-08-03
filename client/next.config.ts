import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   ppr: 'incremental',
  // },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 't3.ftcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cms-platform-s3.s3.eu-north-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true
  },

  eslint: {
    ignoreDuringBuilds: true
  }

};

export default nextConfig;
