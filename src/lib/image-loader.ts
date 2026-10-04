"use client";

type LoaderArgs = { src: string; width: number; quality?: number };

/**
 * Maps next/image requests onto the image CDN. Unsplash (imgix) handles
 * resizing and modern formats (auto=format → AVIF/WebP). Local or other
 * remote sources pass through untouched so a CMS can supply its own URLs.
 */
export default function imageLoader({ src, width, quality }: LoaderArgs) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 72));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    return url.toString();
  }
  return src;
}
