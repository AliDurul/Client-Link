import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   ppr: 'incremental',
  // },

  images: {
    remotePatterns: [new URL('https://t3.ftcdn.net/**')],
  },
  typescript: {
    ignoreBuildErrors: true
  },

  eslint: {
    ignoreDuringBuilds: true
  }

};

export default nextConfig;
