import type { SiteConfig } from "./types";

export const site: SiteConfig = {
  // Placeholder domain (.example is reserved and never resolves). Replace before launch,
  // or set NEXT_PUBLIC_SITE_URL in the environment.
  url: "https://www.atelierestates.example",
  name: "Atelier Estates",
  description:
    "Exceptional properties. Distinctive architecture. Thoughtfully selected spaces across Mumbai, Goa, Bengaluru, Pune and Alibaug.",
  shortName: "Atelier",
  tagline: "The art of finding your place.",
  email: "advisory@atelierestates.in",
  phone: "+91 22 4000 1180",
  whatsapp: "919820001180",
  whatsappGreeting: "Hello Atelier Estates, I'd like to speak with an advisor.",
  address: "Level 14, One Marine Crescent, Nariman Point, Mumbai 400021",
  postalAddress: {
    streetAddress: "Level 14, One Marine Crescent, Nariman Point",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "400021",
    addressCountry: "IN",
  },
  openingHours: "Mo-Su 09:00-21:00",
  areaServed: ["Mumbai", "Goa", "Bengaluru", "Pune", "Alibaug"],
  coordinates: { lat: 18.9256, lng: 72.8242 },
  nav: [
    { label: "Properties", href: "/properties" },
    { label: "Developments", href: "/developments" },
    { label: "About", href: "/about" },
    { label: "Locations", href: "/locations" },
    { label: "Journal", href: "/journal" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Pinterest", href: "https://pinterest.com" },
  ],
  stats: [
    { value: 15, suffix: "+", label: "Years of practice" },
    { value: 120, suffix: "+", label: "Residences placed" },
    { value: 18, label: "Locations" },
    { value: 500, suffix: "+", label: "Clients advised" },
  ],
};
