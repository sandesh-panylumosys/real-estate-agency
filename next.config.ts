import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Imagery is served from a CDN that already resizes and negotiates AVIF/WebP,
    // so a custom loader maps next/image srcsets directly onto it.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
};

export default nextConfig;
