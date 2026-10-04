/**
 * Domain types. Presentation components depend only on these shapes, so the
 * data source behind `src/lib/repository.ts` (local fixtures today; a CMS,
 * Supabase or REST API later) can change without touching the UI.
 */

export type ImageAsset = {
  src: string;
  alt: string;
};

export type PropertyType =
  | "Apartment"
  | "Villa"
  | "Penthouse"
  | "Plot"
  | "Commercial"
  | "Farmhouse";

export type Purpose = "Buy" | "Rent" | "Invest";

export type Coordinates = { lat: number; lng: number };

export type Property = {
  slug: string;
  name: string;
  tagline: string;
  type: PropertyType;
  purpose: Purpose[];
  city: string;
  neighborhood: string;
  coordinates: Coordinates;
  /** Sale price in INR, or monthly rent when `purpose` is only Rent. */
  price: number;
  priceSuffix?: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  status: "Ready" | "Under Construction" | "New Launch";
  architect?: string;
  description: string;
  highlights: string[];
  hero: ImageAsset;
  gallery: ImageAsset[];
  featured?: boolean;
  floorPlanId?: string;
  locationId?: string;
};

export type WalkthroughStage = {
  id: string;
  room: string;
  areaSqft?: number;
  detail: string;
  description: string;
  image: ImageAsset;
};

export type MaterialDetail = {
  id: string;
  chapter: "Material" | "Architecture" | "Interior" | "Detail";
  label: string;
  spec: string;
  description: string;
  image: ImageAsset;
  /** Annotation anchor as a percentage of the image box. */
  pin: { x: number; y: number };
};

export type FloorPlanRoom = {
  id: string;
  name: string;
  areaSqft: number;
  /** SVG path in the plan's 1000×640 coordinate space. */
  path: string;
  label: { x: number; y: number };
  image: ImageAsset;
  note: string;
};

export type FloorPlan = {
  id: string;
  title: string;
  totalSqft: number;
  rooms: FloorPlanRoom[];
};

export type PlaceCategory =
  | "Schools"
  | "Restaurants"
  | "Business"
  | "Shopping"
  | "Parks"
  | "Airport"
  | "Hospitals"
  | "Entertainment";

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory;
  minutes: number;
  /** Polar position from the property: bearing in degrees, distance in km. */
  bearing: number;
  km: number;
};

export type LocationGuide = {
  id: string;
  neighborhood: string;
  city: string;
  coordinates: Coordinates;
  summary: string;
  places: Place[];
};

export type InvestmentMetric = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  note: string;
};

export type InvestmentStory = {
  headline: string;
  metrics: InvestmentMetric[];
  /** Indexed capital-value series, base year = 100. */
  series: { year: number; value: number }[];
  infrastructure: { year: string; title: string; detail: string }[];
};

export type Development = {
  slug: string;
  index: string;
  name: string;
  city: string;
  neighborhood: string;
  completion: string;
  progress: number;
  residences: string;
  summary: string;
  image: ImageAsset;
};

export type Testimonial = {
  id: string;
  quote: string;
  story: string;
  client: string;
  property: string;
  location: string;
  image: ImageAsset;
};

/** Portable article body — maps cleanly onto CMS rich-text block formats. */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; image: ImageAsset; caption?: string }
  | { type: "list"; items: string[] };

export type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  date: string;
  /** ISO date for sorting and <time> elements. */
  isoDate: string;
  author: { name: string; role: string };
  image: ImageAsset;
  body: ArticleBlock[];
};

export type AgencyStat = { value: number; suffix?: string; label: string };

export type City = {
  slug: string;
  name: string;
  state: string;
  summary: string;
  coordinates: Coordinates;
  neighbourhoods: string[];
  image: ImageAsset;
  /** Optional link to a detailed LocationGuide. */
  guideId?: string;
};

export type SiteConfig = {
  /** Canonical origin, no trailing slash. Overridable with NEXT_PUBLIC_SITE_URL. */
  url: string;
  name: string;
  description: string;
  shortName: string;
  tagline: string;
  email: string;
  phone: string;
  /** WhatsApp number in international format, digits only (e.g. 919820001180). */
  whatsapp: string;
  whatsappGreeting: string;
  address: string;
  postalAddress: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  openingHours: string;
  coordinates: Coordinates;
  areaServed: string[];
  nav: { label: string; href: string }[];
  social: { label: string; href: string }[];
  stats: AgencyStat[];
};
