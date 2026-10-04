import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";
import { AdvisorBand } from "@/components/layout/AdvisorBand";
import { PageHero } from "@/components/layout/PageHero";
import { CityIndex } from "@/components/pages/CityIndex";
import { Enquiry } from "@/components/sections/Enquiry";
import { InvestmentStory } from "@/components/sections/InvestmentStory";
import { LocationExperience } from "@/components/sections/LocationExperience";
import { media } from "@/data/media";
import { getCities, getInvestmentStory, getLocationGuide, getProperties } from "@/lib/repository";

export const metadata: Metadata = pageMetadata({
  title: "Locations & Neighbourhood Guides",
  description:
    "Luxury homes in Mumbai, Goa, Bengaluru, Pune and Alibaug — neighbourhood guides, nearby schools, hospitals and commutes, and local market context.",
  path: "/locations",
  image: { src: media.towersUp, alt: "Glass towers seen from street level" },
});

export default async function LocationsPage() {
  const [cities, properties, guide, investment] = await Promise.all([
    getCities(),
    getProperties(),
    getLocationGuide("juhu"),
    getInvestmentStory(),
  ]);
  const counts = properties.reduce<Record<string, number>>((acc, p) => {
    acc[p.city] = (acc[p.city] ?? 0) + 1;
    return acc;
  }, {});
  const neighbourhoods = cities.reduce((n, c) => n + c.neighbourhoods.length, 0);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Locations", path: "/locations" }]),
          itemListSchema(
            "Locations",
            cities.map((c) => ({ name: `Luxury properties in ${c.name}`, path: `/properties?city=${encodeURIComponent(c.name)}` })),
          ),
        ]}
      />
      <PageHero
        eyebrow="Locations"
        title="Where your"
        accent="life happens."
        intro="We work in a handful of places we know street by street — the schools, the light, the quiet corners and the commute."
        image={{ src: media.towersUp, alt: "Glass towers seen from street level" }}
        annotation="5 cities · Western & Southern India"
        stats={[
          { label: "Cities", value: String(cities.length).padStart(2, "0") },
          { label: "Neighbourhoods", value: String(neighbourhoods) },
        ]}
      />
      <CityIndex cities={cities} counts={counts} index="01" />
      <LocationExperience guide={guide} index="02" />
      <InvestmentStory data={investment} index="03" />
      <AdvisorBand
        title="Not sure where to begin?"
        body="An advisor can walk you through neighbourhoods by commute, schools and lifestyle."
        message="Hello Atelier Estates, I'd like advice on which neighbourhood would suit me."
      />
      <Enquiry index="04" />
    </>
  );
}
