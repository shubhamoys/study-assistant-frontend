import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Next's dev server blocks cross-origin requests to dev-only assets
  // (HMR, RSC payloads, etc.) from any host other than localhost by
  // default — silently, with no error surfaced to the page, just a dead
  // page that never hydrates. This is what lets a phone on the same Wi-Fi
  // load the app when it's started with `next dev -H 0.0.0.0` (see
  // AGENT_CONTEXT.md's CORS/LAN decision-log entry for the full mobile-
  // testing setup). `192.168.*.*` covers the common home-network range;
  // widen this (or add `10.*.*.*`) if testing from a different subnet.
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
