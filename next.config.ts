import type { NextConfig } from "next";

import { CARD_ORIGIN, HOST_ORIGIN } from "./lib/origins";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  allowedDevOrigins: [new URL(HOST_ORIGIN).hostname, new URL(CARD_ORIGIN).hostname],
  async headers() {
    return [
      {
        // Like a real provider, the card form may only be framed by itself (the field iframes) and the shop.
        source: "/embed/:path*",
        headers: [{ key: "Content-Security-Policy", value: `frame-ancestors 'self' ${HOST_ORIGIN}` }],
      },
    ];
  },
  experimental: {
    agentFeedback: false,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
