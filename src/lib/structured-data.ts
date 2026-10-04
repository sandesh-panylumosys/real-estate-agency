import { media } from "@/data/media";
import { site } from "@/data/site";
import type { Article, Development, Property } from "@/data/types";
import { absoluteUrl, ogImage } from "./seo";

/**
 * schema.org JSON-LD builders. Entities reference each other by @id so search
 * engines can connect the agency, its listings and its articles.
 */

const ORG_ID = absoluteUrl("/#organization");
const WEBSITE_ID = absoluteUrl("/#website");

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": ORG_ID,
    name: site.name,
    description: site.description,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.svg"),
    image: ogImage({ src: media.villaPool, alt: site.name }).url,
    telephone: site.phone,
    email: site.email,
    address: { "@type": "PostalAddress", ...site.postalAddress },
    geo: { "@type": "GeoCoordinates", latitude: site.coordinates.lat, longitude: site.coordinates.lng },
    openingHours: site.openingHours,
    areaServed: site.areaServed.map((name) => ({ "@type": "City", name })),
    sameAs: site.social.map((s) => s.href),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: site.phone,
        areaServed: "IN",
        availableLanguage: ["English", "Hindi", "Marathi"],
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/"),
    name: site.name,
    description: site.description,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function itemListSchema(name: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

const RESIDENCE_TYPE: Record<Property["type"], string> = {
  Apartment: "Apartment",
  Penthouse: "Apartment",
  Villa: "SingleFamilyResidence",
  Farmhouse: "House",
  Plot: "Landform",
  Commercial: "Place",
};

export function propertySchema(p: Property) {
  const url = absoluteUrl(`/properties/${p.slug}`);
  const isRent = !!p.priceSuffix;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    url,
    name: p.name,
    description: p.description,
    image: [ogImage(p.hero).url, ...p.gallery.map((g) => ogImage(g).url)],
    provider: { "@id": ORG_ID },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "INR",
      businessFunction: isRent ? "http://purl.org/goodrelations/v1#LeaseOut" : "http://purl.org/goodrelations/v1#Sell",
      ...(isRent
        ? { priceSpecification: { "@type": "UnitPriceSpecification", price: p.price, priceCurrency: "INR", unitCode: "MON" } }
        : {}),
      availability: p.status === "Ready" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      seller: { "@id": ORG_ID },
    },
    about: {
      "@type": RESIDENCE_TYPE[p.type],
      name: p.name,
      ...(p.bedrooms ? { numberOfBedrooms: p.bedrooms, numberOfRooms: p.bedrooms } : {}),
      ...(p.bathrooms ? { numberOfBathroomsTotal: p.bathrooms } : {}),
      floorSize: { "@type": "QuantitativeValue", value: p.areaSqft, unitCode: "FTK" },
      address: {
        "@type": "PostalAddress",
        addressLocality: p.neighborhood,
        addressRegion: p.city,
        addressCountry: "IN",
      },
      geo: { "@type": "GeoCoordinates", latitude: p.coordinates.lat, longitude: p.coordinates.lng },
      ...(p.highlights.length ? { amenityFeature: p.highlights.map((h) => ({ "@type": "LocationFeatureSpecification", name: h, value: true })) } : {}),
    },
  };
}

export function developmentSchema(d: Development) {
  return {
    "@type": "Residence",
    name: d.name,
    description: d.summary,
    image: ogImage(d.image).url,
    address: { "@type": "PostalAddress", addressLocality: d.neighborhood, addressRegion: d.city, addressCountry: "IN" },
  };
}

export function articleSchema(a: Article) {
  const url = absoluteUrl(`/journal/${a.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: a.title,
    description: a.excerpt,
    image: [ogImage(a.image).url],
    datePublished: a.isoDate,
    dateModified: a.isoDate,
    articleSection: a.category,
    inLanguage: "en-IN",
    author: { "@type": "Person", name: a.author.name, jobTitle: a.author.role },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    wordCount: a.body.reduce((n, b) => {
      if (b.type === "p" || b.type === "h" || b.type === "quote") return n + b.text.split(/\s+/).length;
      if (b.type === "list") return n + b.items.join(" ").split(/\s+/).length;
      return n;
    }, 0),
  };
}
