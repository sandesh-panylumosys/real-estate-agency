import "server-only";

import { cities } from "@/data/cities";
import { articles, developments, investment, locationGuides, testimonials } from "@/data/editorial";
import { floorPlans, materialDetails, walkthrough } from "@/data/experience";
import { properties } from "@/data/properties";
import type { Property, Purpose, PropertyType } from "@/data/types";

/**
 * Data access layer.
 *
 * Every page and section reads through these async functions instead of
 * importing fixtures directly. To move to a CMS, Supabase or a REST API,
 * replace the bodies here (e.g. `supabase.from("properties").select()`),
 * keeping the return types from `src/data/types.ts`.
 */

export async function getProperties(filter?: {
  type?: PropertyType;
  purpose?: Purpose;
  city?: string;
}): Promise<Property[]> {
  return properties.filter(
    (p) =>
      (!filter?.type || p.type === filter.type) &&
      (!filter?.purpose || p.purpose.includes(filter.purpose)) &&
      (!filter?.city || p.city === filter.city),
  );
}

export async function getFeaturedProperties() {
  return properties.filter((p) => p.featured);
}

export async function getPropertyBySlug(slug: string) {
  return properties.find((p) => p.slug === slug) ?? null;
}

export async function getFloorPlan(id?: string) {
  return floorPlans.find((f) => f.id === id) ?? floorPlans[0];
}

export async function getLocationGuide(id?: string) {
  return locationGuides.find((l) => l.id === id) ?? locationGuides[0];
}

export async function getWalkthrough() {
  return walkthrough;
}

export async function getMaterialDetails() {
  return materialDetails;
}

export async function getInvestmentStory() {
  return investment;
}

export async function getDevelopments() {
  return developments;
}

export async function getTestimonials() {
  return testimonials;
}

export async function getArticles() {
  return [...articles].sort((a, b) => b.isoDate.localeCompare(a.isoDate));
}

export async function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function getCities() {
  return cities;
}
