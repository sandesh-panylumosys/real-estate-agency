import type { MetadataRoute } from "next";
import { getArticles, getProperties } from "@/lib/repository";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, articles] = await Promise.all([getProperties(), getArticles()]);
  const latestArticle = articles[0]?.isoDate;

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/properties"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/developments"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/locations"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/journal"), changeFrequency: "weekly", priority: 0.7, lastModified: latestArticle },
  ];

  return [
    ...pages,
    ...properties.map((p) => ({
      url: absoluteUrl(`/properties/${p.slug}`),
      changeFrequency: "weekly" as const,
      priority: p.featured ? 0.8 : 0.7,
    })),
    ...articles.map((a) => ({
      url: absoluteUrl(`/journal/${a.slug}`),
      lastModified: a.isoDate,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
