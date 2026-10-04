import type { Metadata } from "next";
import { site } from "@/data/site";
import type { ImageAsset } from "@/data/types";

/** Canonical origin. Set NEXT_PUBLIC_SITE_URL in production to override the placeholder. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? site.url).replace(/\/$/, "");

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** 1200×630 social image, cropped by the image CDN. */
export function ogImage(image: ImageAsset) {
  const url = image.src.startsWith("https://images.unsplash.com/")
    ? `${image.src}?w=1200&h=630&fit=crop&crop=entropy&q=75&auto=format`
    : image.src;
  return { url, width: 1200, height: 630, alt: image.alt };
}

/**
 * Per-page metadata: title, description, canonical URL, Open Graph and
 * Twitter card. Open Graph is replaced (not merged) by Next.js when a page
 * defines it, so the shared fields are repeated here.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  absoluteTitle,
  publishedTime,
  authors,
}: {
  title: string;
  description: string;
  path: string;
  image: ImageAsset;
  type?: "website" | "article";
  /** Use the title as-is instead of the "%s — Atelier Estates" template. */
  absoluteTitle?: boolean;
  publishedTime?: string;
  authors?: string[];
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} — ${site.name}`;
  const img = ogImage(image);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    authors: authors?.map((name) => ({ name })),
    openGraph: {
      type,
      url: path,
      siteName: site.name,
      locale: "en_IN",
      title: fullTitle,
      description,
      images: [img],
      ...(type === "article" ? { publishedTime, authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [img.url],
    },
  };
}
