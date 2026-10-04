import { media } from "./media";
import type {
  Development,
  InvestmentStory,
  LocationGuide,
  Testimonial,
} from "./types";

export const locationGuides: LocationGuide[] = [
  {
    id: "juhu",
    neighborhood: "Juhu",
    city: "Mumbai",
    coordinates: { lat: 19.1075, lng: 72.8263 },
    summary:
      "A quiet, leafy stretch of the western coast — ten minutes from the airport, a walk from the sea, and close to the city's best tables.",
    places: [
      { id: "p1", name: "Ecole Mondiale World School", category: "Schools", minutes: 6, bearing: 40, km: 1.8 },
      { id: "p2", name: "Dhirubhai Ambani Intl. School", category: "Schools", minutes: 22, bearing: 95, km: 9.5 },
      { id: "p3", name: "Juhu Beach Promenade", category: "Parks", minutes: 4, bearing: 270, km: 0.9 },
      { id: "p4", name: "Joggers' Park", category: "Parks", minutes: 12, bearing: 200, km: 3.6 },
      { id: "p5", name: "Chhatrapati Shivaji Intl. Airport", category: "Airport", minutes: 15, bearing: 70, km: 5.2 },
      { id: "p6", name: "Bandra Kurla Complex", category: "Business", minutes: 25, bearing: 140, km: 9.0 },
      { id: "p7", name: "Andheri East Business District", category: "Business", minutes: 20, bearing: 55, km: 6.8 },
      { id: "p8", name: "Kokilaben Hospital", category: "Hospitals", minutes: 14, bearing: 10, km: 4.4 },
      { id: "p9", name: "Nanavati Max Hospital", category: "Hospitals", minutes: 8, bearing: 120, km: 2.4 },
      { id: "p10", name: "Prithvi Theatre", category: "Entertainment", minutes: 5, bearing: 300, km: 1.2 },
      { id: "p11", name: "Jio World Drive", category: "Shopping", minutes: 24, bearing: 150, km: 8.6 },
      { id: "p12", name: "Linking Road", category: "Shopping", minutes: 16, bearing: 175, km: 5.4 },
      { id: "p13", name: "The Bombay Canteen", category: "Restaurants", minutes: 26, bearing: 160, km: 10.0 },
      { id: "p14", name: "Juhu Coastline Dining", category: "Restaurants", minutes: 5, bearing: 240, km: 1.4 },
    ],
  },
];

export const investment: InvestmentStory = {
  headline: "Beyond the property",
  metrics: [
    { label: "Capital appreciation", value: 9.4, suffix: "%", decimals: 1, note: "Avg. annual, prime western suburbs, 2016–2026" },
    { label: "Gross rental yield", value: 3.6, suffix: "%", decimals: 1, note: "Furnished luxury residences" },
    { label: "Infrastructure committed", value: 1.2, prefix: "₹", suffix: " L Cr", decimals: 1, note: "Metro, coastal road & airport links" },
    { label: "Avg. days to lease", value: 21, note: "Atelier-managed portfolio" },
  ],
  series: [
    { year: 2016, value: 100 },
    { year: 2017, value: 104 },
    { year: 2018, value: 111 },
    { year: 2019, value: 117 },
    { year: 2020, value: 115 },
    { year: 2021, value: 124 },
    { year: 2022, value: 141 },
    { year: 2023, value: 158 },
    { year: 2024, value: 179 },
    { year: 2025, value: 196 },
    { year: 2026, value: 214 },
  ],
  infrastructure: [
    { year: "2024", title: "Coastal Road", detail: "Juhu to Nariman Point in under 30 minutes." },
    { year: "2025", title: "Metro Line 2B", detail: "Direct connection to BKC and the eastern suburbs." },
    { year: "2026", title: "Navi Mumbai Airport", detail: "A second international gateway for the region." },
    { year: "2028", title: "Versova–Bandra Sea Link", detail: "A new coastal artery along the western edge." },
  ],
};

export const developments: Development[] = [
  {
    slug: "the-arden",
    index: "01",
    name: "The Arden",
    city: "Mumbai",
    neighborhood: "Worli Sea Face",
    completion: "Q4 2027",
    progress: 62,
    residences: "48 residences · 3–5 bedrooms",
    summary: "A slender tower of terracotta fins, each residence opening onto a planted sky garden.",
    image: { src: media.apartmentBlock, alt: "Residential tower against a blue sky" },
  },
  {
    slug: "maison-verde",
    index: "02",
    name: "Maison Verde",
    city: "Bengaluru",
    neighborhood: "Hebbal Lake",
    completion: "Q2 2028",
    progress: 34,
    residences: "26 garden villas",
    summary: "Garden villas arranged around a restored lakeside landscape and a shared orchard.",
    image: { src: media.apartmentBalconies, alt: "Residential building with planted balconies" },
  },
  {
    slug: "kora-heights",
    index: "03",
    name: "Kora Heights",
    city: "Pune",
    neighborhood: "Baner Hills",
    completion: "Q1 2027",
    progress: 81,
    residences: "72 residences · 2–4 bedrooms",
    summary: "Stepped terraces cut into the hillside, oriented for cross-breezes and valley views.",
    image: { src: media.apartmentFacade, alt: "Facade of a contemporary apartment building" },
  },
  {
    slug: "the-foundry",
    index: "04",
    name: "The Foundry",
    city: "Mumbai",
    neighborhood: "Lower Parel",
    completion: "Q3 2029",
    progress: 12,
    residences: "Lofts & workspace",
    summary: "A former textile mill reimagined as lofts, studios and a public courtyard.",
    image: { src: media.darkFacade, alt: "Dark facade with warm lit windows" },
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote: "We weren't searching for another apartment. We were searching for a place that felt like home.",
    story:
      "After eighteen months of viewings, Atelier showed us a residence that wasn't even on the market. We knew from the entrance.",
    client: "Ananya & Vikram Mehra",
    property: "The Kiln, Residence 1102",
    location: "Bandra West, Mumbai",
    image: { src: media.livingWhite2, alt: "Bright living room with white furnishings" },
  },
  {
    id: "t2",
    quote: "They understood the light we wanted before we could describe it.",
    story:
      "We moved from London with two children and a long list. The house in Assagao met every line of it — and a few we hadn't written.",
    client: "Rhea Kapoor",
    property: "Villa Serein",
    location: "Assagao, Goa",
    image: { src: media.livingArches, alt: "Living room with arched windows" },
  },
  {
    id: "t3",
    quote: "Every number was honest. Every recommendation was considered.",
    story:
      "As an investor, I value clarity over persuasion. Three acquisitions later, the portfolio has performed exactly as they said it would.",
    client: "Daniel Fernandes",
    property: "Sky Loft 27",
    location: "Lower Parel, Mumbai",
    image: { src: media.diningRoom, alt: "Elegant dining room" },
  },
];

export { articles } from "./journal";
